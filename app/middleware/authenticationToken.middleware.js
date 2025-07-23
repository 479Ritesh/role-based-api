const jwt = require('jsonwebtoken');
const {
    TOKEN_KEY,
    INVALID_TOKEN,
    HEADERS1,
    AUTH_REQUIRED,
} = require('../libs/constants');
const { FORBIDDEN , UNAUTHORIZED } = require('../libs/httpcode');

const verifyAuthToken = (request, response, next) => {
    const token =
        request.body.token || request.query.token || request.headers[HEADERS1];

    if (!token) {
        return response.status(FORBIDDEN ).json({ error: AUTH_REQUIRED });
    }
    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        request.user = decoded;
        { id: decoded.id };

    } catch (err) {
        return response.status(UNAUTHORIZED).json({ error: INVALID_TOKEN });
    }
    next();
};

module.exports = verifyAuthToken;