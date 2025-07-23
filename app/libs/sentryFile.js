const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://7e9397505a63ed4a66c74f81ec1198ea@o4508579829121024.ingest.us.sentry.io/4508579830562816",
});

const captureException = (e) => {
  console.log("ffffffffffffffff");
  Sentry.captureException(e);
};

const captureMessageLog = (errorMessage) => {
  console.log("ffffffffffffffffggggggggggg");

  Sentry.captureMessage(errorMessage);
};

module.exports = {
  captureException,
  captureMessageLog,
};
