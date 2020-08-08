const db = require("../data/db-config");

module.exports = {
    findById,
    add
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