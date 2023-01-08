require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.APP_PORT || 3000;
const { appTokenService } = require('./services/token.service');
const {authRouter} = require('./routes/auth.route');
const {userRouter} = require('./routes/user.route');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/home", (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use("/login", (req, res) => {
    res.sendFile(path.join(__dirname+'/login.html'));
});

app.use("/register", (req, res) => {
    res.sendFile(path.join(__dirname+'/register.html'));
});
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
    appTokenService.getAppAccessToken();
})
