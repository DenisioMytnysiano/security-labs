const { authService } = require("../services/auth.service");
const sessions = require('../middleware/session/session');

const login = async (req, res) => {
    const { login, password } = req.body;
    try{
        const {accessToken, refreshToken} = await authService.login(login, password);
        req.session.login = login;
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        sessions.set(req.session.sessionId, req.session);
        console.log(`User ${login} logged in sucessfully.\nAccess token: ${accessToken}\nRefresh token: ${refreshToken}`);
        res.status(200).json({sessionId: req.session.sessionId});
    }
    catch(ex){
        console.error(ex);
        res.status(500).json({error: ex.message});
    }
}

const register = async (req, res) => {
    const { login, password } = req.body;
    try{
        await authService.register(login, password);
        res.status(201);
    }
    catch(ex){
        console.error(ex)
        res.status(500).json({error: ex.message})
    }
}

module.exports = {
    login,
    register
}