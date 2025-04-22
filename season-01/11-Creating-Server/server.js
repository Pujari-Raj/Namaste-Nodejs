// creating a serve
const http = require("node:http");

// creating instance of server
const server = http.createServer(function (req, resp) {

    if (req.url === "/userData") {
        resp.end("username:carpiediem");
    }
    resp.end("hello User");
}) 

server.listen(8080);