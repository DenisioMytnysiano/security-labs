const uuid = require('uuid');
const express = require('express');
const jwt = require("jsonwebtoken");
const onFinished = require('on-finished');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN_KEY = 'Authorization';
const PRIVATE_KEY = 'Denisio';
class Session {
    #sessions = {}

    constructor() {
        try {
            this.#sessions = fs.readFileSync('./sessions.json', 'utf8');
            this.#sessions = JSON.parse(this.#sessions.trim());

            console.log(this.#sessions);
        } catch(e) {
            this.#sessions = {};
        }
    }

    #storeSessions() {
        fs.writeFileSync('./sessions.json', JSON.stringify(this.#sessions), 'utf-8');
    }

    set(key, value) {
        if (!value) {
            value = {};
        }
        this.#sessions[key] = value;
        this.#storeSessions();
    }

    get(key) {
        return this.#sessions[key];
    }

    init(res) {
        const sessionId = uuid.v4();
        this.set(sessionId);

        return sessionId;
    }

    destroy(req, res) {
        const sessionId = req.sessionId;
        delete this.#sessions[sessionId];
        this.#storeSessions();
    }
}

const sessions = new Session();

app.use((req, res, next) => {
    let currentSession = {};
    let token = req.get(TOKEN_KEY);
    
    try{
        if(token){
            let validatedToken = jwt.verify(token, PRIVATE_KEY);
            let sessionId = validatedToken.sessionId;
            if (sessionId) {
                currentSession = sessions.get(sessionId);
                if (!currentSession) {
                    currentSession = {};
                    sessionId = sessions.init(res);
                }
            }
        }
        else {
            sessionId = sessions.init(res);
        }

        req.session = currentSession;
        req.sessionId = sessionId;

        onFinished(req, () => {
            const currentSession = req.session;
            const sessionId = req.sessionId;
            sessions.set(sessionId, currentSession);
        });

        next();
    }
    catch(ex){
        res.send("Jwt token invalid or expired");
    }
});

app.get('/', (req, res) => {
    if (req.session.username) {
        return res.json({
            username: req.session.username,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false
    });

    if (user) {
        req.session.username = user.username;
        req.session.login = user.login;
        
        var token = jwt.sign({sessionId: req.sessionId}, PRIVATE_KEY, {expiresIn: "2h"})
        res.json({ token: token });
    }

    res.status(401).send();
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
