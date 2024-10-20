import { UserController } from './user_controller';
import { userController } from '../configuration/app_config';
import { IncomingMessage, ServerResponse, RequestListener } from 'http';
import { ValidationError } from '../error/validation_error';

const controller: UserController = userController;

function handleNotFound(req: IncomingMessage, res: ServerResponse) {
    console.log(`Path - [${req.url}] with method - [${req.method}] not found`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Not Found with Path - [${req.url}], method - [${req.method}]` }));
}


function handleError(req: IncomingMessage, res: ServerResponse, err: any) {
    if (err instanceof ValidationError) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message, errors: err.errors }));
        return;
    }

    console.log(`Unexpected error - [${err.message}]`);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Unexpected error- - [${err.message}]` }));
}

async function handleGetUsers(res: ServerResponse) {
    let foundUsers = await controller.getAllUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(foundUsers));
}

async function handleCreateUser(req: IncomingMessage, res: ServerResponse) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const userData = JSON.parse(body);
            const newUser = await controller.createUser(userData);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (err) {
            handleError(req, res, err);
        }
    });
}

export const requestListener: RequestListener = async (req: IncomingMessage, res: ServerResponse) => {

    req.on('error', err => {
        handleError(req, res, err);
    });

    if (req.url === "/api/users") {
        if (req.method === "GET") {
            await handleGetUsers(res);
            return;
        } else if (req.method === 'POST') {
            await handleCreateUser(req, res);
            return;
        }
    }

    handleNotFound(req, res);
};