const { auth } = require('express-oauth2-jwt-bearer');

const oauthMiddleware = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.API_URL,
  });

module.exports = oauthMiddleware;
  