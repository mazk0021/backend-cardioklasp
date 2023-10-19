const notFound = (req, res, next) => {
    const error = new Error(`${req.originalUrl} not found`)
    console.log("req.originalUrl: " + req.originalUrl)
    res.status(404);
    next(error);
}

const errorHandler = (req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENVIRONMENT === "production" ? null : err.stack
    })

    next(error);
}

module.exports = { notFound, errorHandler }