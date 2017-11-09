const _ = require('lodash');

const catchRequestErrorSync = (fn) => {
  return function (req, res, next) {
    try {
      return fn(req, res, next);
    } catch (err) {
      return requestErrorHandler(err, req, res);
    }
  };
};

const catchRequestError = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(err => requestErrorHandler(err, req, res));
  };
};

const requestErrorHandler = (err, req, res) => {
  const error = flattenProps(err);
  if (Object.keys(knownErrors).includes(error.name)) {
    console.log('known error: ', error);
    return res.status(error.status || 400).json(error);
  } else {
    console.log('unknown error: ', error);
    return res.status(error.status || 500).json(error);
  }
};

const flattenProps = (obj) => {
  /* returns a cloned object with all properties at top level,
  allowing them to be preserved by JSON.stringify */
  const props = Object.getOwnPropertyNames(obj);
  const vals = props.map(p => obj[p]);
  return _.zipObject(props, vals);
};

const notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

class BaseError extends Error {
  constructor(message) {
    super(message);
    this.status = super.status || 500;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class InvalidRequestError extends BaseError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

const knownErrors = {
  InvalidRequestError,
};

module.exports = {
  ...knownErrors,
  knownErrors,
  requestErrorHandler,
  catchRequestErrorSync,
  catchRequestError,
  notFound,
};
