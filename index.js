const express = require("express");
const welcomRouter= require("./welcome/welcome_router")
const postsRouter = require("./post")

const server = express();
const port = 5000;

server.use(express.json());
server.use(welcomRouter);
server.use(postsRouter);

server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});


