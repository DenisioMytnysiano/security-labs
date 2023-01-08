const sessions = require('./session');
const onFinished = require("on-finished");
const SESSION_KEY = 'Authorization';
const { appTokenService } = require("../../services/token.service");
const { authService } = require('../../services/auth.service');

const sessionMiddleware = async (req, res, next) => {
    let currentSession = {};
    let sessionId = req.get(SESSION_KEY);

    if (sessionId) {
        currentSession = sessions.get(sessionId);
        if (!currentSession) {
            currentSession = {};
            sessionId = sessions.init(res);
        } else if (currentSession.accessToken && appTokenService.isTokenExpired(currentSession.accessToken)){
            const accessToken = await appTokenService.refreshUserToken(currentSession.refreshToken);
            console.log(`Refreshed user token for session ${sessionId}. Access token: ${accessToken}`);
            currentSession.accessToken = accessToken;
        }
    } else {
        sessionId = sessions.init(res);
    }

    req.session = currentSession;
    req.session.sessionId = sessionId;

    onFinished(req, () => {
        const currentSession = req.session;
        const sessionId = req.sessionId;
        sessions.set(sessionId, currentSession);
    });

    next();
};

module.exports = sessionMiddleware;