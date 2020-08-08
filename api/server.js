const express = require("express");
const server = express();
const authRouter = require("../auth/auth-router")

server.use(express.json());
server.use("/api", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;