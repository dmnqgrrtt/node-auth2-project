const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");
const restrict = require("./restricted-middleware");

router.post("/register", validateCreds, (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(newUser => {
            res.status(201).json({ data: newUser });
        })
        .catch(err => {
            res.status(500).json({ message: "we were unable to add this user" })
        })
});

router.post("/login", validateCreds, (req, res) => {
    const { username, password } = req.body;

    Users.findUser({ username: username })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = createToken(user);
                res.status(200).json({ token: token })
            } else {
                res.status(401).json({ message: "You shall not pass" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "We were unable to retrieve that user" })
        })
});

router.get("/users", restrict, (req, res) => {
    Users.getUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: "we were unable to retrieve the users" })
        })
})

function createToken(user) {

    const payload = {
        subject: user.id,
        username: user.username
    }

    const secret = secrets.jwtSecret;

    const options = {
        expiresIn: "1h"
    }

    return jwt.sign(payload, secret, options)
}

function validateCreds(req, res, next) {
    let user = req.body;

    if (user.username) {
        if (user.password) {
            next();
        } else {
            res.status(400).json({ message: "please provide a password" })
        }
    } else {
        res.status(400).json({ message: "please provide a username" })
    }
}

module.exports = router;