export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Logs the error for debugging

    // Default Error Status
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // MongoDB Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    // MongoDB CastError (Invalid ID format)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    res.status(statusCode).json({ error: message });
};
