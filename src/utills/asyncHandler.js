export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        const statusCode = Number.isInteger(error.code) && error.code >= 100 && error.code < 600 ? error.code : 500;
        
        res.status(statusCode).json({
            message: error.message || 'An unknown error occurred',
            success: false
        });
    }
};
