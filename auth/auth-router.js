const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model")

router.post("/register", validateNewUser, (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
    .then(newUser =>{
        res.status(201).json({data: newUser});
    })
    .catch(err =>{
        res.status(500).json({message: "we were unable to add this user"})
    })
})

function validateNewUser(req, res, next) {
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