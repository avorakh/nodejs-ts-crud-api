import { createServer, RequestListener } from "http";
import { UserController } from './controller/user_controller';
import { userController } from './configuration/app_config';

const PORT = process.env.PORT || 4000;

const controller: UserController = userController;

const requestListener: RequestListener = async (req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await controller.getAllUsers()));
    } else {
        console.log(`Path - [${req.url}] with method - [${req.method}] not found`)
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Not Found with Path - [${req.url}], method - [${req.method}]` }));
    }
};

const server = createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
