const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        console.log("Token from session:", token); // Debugging statement
        jwt.verify(token, 'fingerprint_customer', (err, user) => { // Ensure 'fingerprint_customer' matches the one used during token generation
            if (!err) {
                req.user = user;
                console.log("Decoded user:", user); // Debugging statement
                next();
            } else {
                console.log("Token verification error:", err); // Debugging statement
                return res.status(403).send({ message: "User is not authenticated!" });
            }
        });
    } else {
        return res.status(403).send({ message: "User is not logged in!" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));