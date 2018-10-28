const ErrorType = require('./ErrorType');

class ValidationError extends Error {
    constructor({args = undefined} = {}) {
        super();
        this.args = args;
        this.errorType = ErrorType.INVALID;
        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ValidationError;