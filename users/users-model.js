const db = require("../data/db-config");

module.exports = {
    findById,
    add,
    findUser,
    getUsers
}

function getUsers() {
    return db("users")
        .select("id", "username")
        .orderBy("id");
}

function findById(id) {
    return db("users")
        .where({ id })
        .first();
}

function add(newUser) {
    return db("users")
        .insert(newUser)
        .then(newId => {
            return findById(newId);
        })
}

function findUser(filter) {
    return db("users")
        .where(filter)
        .first();
}