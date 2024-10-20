import { UserController } from './user_controller';
import { userController } from '../configuration/app_config';
import { IncomingMessage, ServerResponse, RequestListener } from 'http';

const controller: UserController = userController;

function handleNotFound(req: IncomingMessage, res: ServerResponse) {
    console.log(`Path - [${req.url}] with method - [${req.method}] not found`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Not Found with Path - [${req.url}], method - [${req.method}]` }));
}

async function handleGetUsers(res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(await controller.getAllUsers()));
}


export const requestListener: RequestListener = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/api/users" && req.method === "GET") {
        await handleGetUsers(res);
        return;
    }

    handleNotFound(req, res);
};