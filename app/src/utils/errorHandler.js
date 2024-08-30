const { APIError, InternalServerError } = require("rest-api-errors");
const { STATUS_CODES } = require("http");

// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  const error =
    err.status === 401 || err instanceof APIError
      ? err
      : new InternalServerError();

  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }

  if (err.name === "ValidationError") {
    return res
      .status(err.code || 422)
      .json({ success: false, message: err.message });
  }

  if (err.name === "CastError" && err.path === "_id") {
    return res
      .status(422)
      .json({ success: false, message: "Invalid ObjectID." });
  }

  return res.status(err.status || 500).json({
    success: false,
    code: err.code || 500,
    message: err.message || STATUS_CODES[error.status],
  });
};

module.exports = { errorHandler };
