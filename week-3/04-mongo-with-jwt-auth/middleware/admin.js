// Middleware for handling auth
function adminMiddleware(req, res, next) {

    const token = req.headers.token.split(" ")[1];
    

    
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
}

module.exports = adminMiddleware;