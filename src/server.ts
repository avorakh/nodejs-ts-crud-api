import http from "http";

const PORT = process.env.PORT || 4000;

const requestListener: http.RequestListener = (req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([]));
    } else {
        console.log(`Path - [${req.url}] with method - [${req.method}] not found`)
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Not Found with Path - [${req.url}], method - [${req.method}]` }));
    }
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
