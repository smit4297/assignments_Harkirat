async function userMiddleware(req, res, next) {

    try {
        const username = req.headers.username;
        const password = req.headers.password;

        if (!username || !password) {
            res.status(401).send("Unauthorized: Missing credentials");
            return;
        }

        const dbAdmin = await User.findOne({ username: username });

        if (dbAdmin && password === dbAdmin.password) {
            // Authentication successful
            next();
        } else {
            // Incorrect credentials
            res.status(401).send("Unauthorized: Incorrect credentials");
        }
    } catch (error) {
        console.error("Error in adminMiddleware:", error);
        res.status(500).send("Internal Server Error");
    }
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
}

module.exports = userMiddleware;