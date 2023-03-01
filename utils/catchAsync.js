// wrapper error handling function for handling async error
// this is added in routes where async callbacks are used

module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next)        
    }
}