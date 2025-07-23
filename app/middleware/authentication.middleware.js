const {
  PUBLIC_KEY1,
  INVALID_TOKEN,
  HEADERS1,
  AUTH_REQUIRED,
} = require("../libs/constants");
const { FORBIDDEN, UNAUTHORIZED } = require("../libs/httpcode");
const verifyToken = (request, response, next) => {
  const token =
    request.body.token || request.query.token || request.headers[HEADERS1];
  if (!token) {
    return response.status(FORBIDDEN).send(AUTH_REQUIRED);
  }
  try {
    if (PUBLIC_KEY1 !== token) throw error;
  } catch (error) {
    return response.status(UNAUTHORIZED).json({ error: INVALID_TOKEN });
  }
  return next();
};

module.exports = verifyToken;
