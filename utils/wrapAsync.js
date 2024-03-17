module.exports = (fn) => {
    // Return a new middleware function
    return (req, res, next) => {
        // Call the original middleware function and handle promise rejections
        fn(req, res, next).catch(next);
    };
};
