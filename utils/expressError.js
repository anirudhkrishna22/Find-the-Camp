// class exdending default error class for custom error handling.
// objects of this class will be created and called to next so that our custom error function app.use() will display this custom message and status code

class ExpressError extends Error{
    constructor(message, statusCode) {
        super()
        this.message = message
        this.status = statusCode
    }
}

module.exports = ExpressError