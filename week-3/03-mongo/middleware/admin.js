// Middleware for handling auth
import "../db/index";
import { Admin } from "../db/index";

async function adminMiddleware(req, res, next) {
    try {
        const username = req.headers.username;
        const password = req.headers.password;

        if (!username || !password) {
            res.status(401).send("Unauthorized: Missing credentials");
            return;
        }

        const dbAdmin = await Admin.findOne({ username: username });

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
}

module.exports = adminMiddleware;
