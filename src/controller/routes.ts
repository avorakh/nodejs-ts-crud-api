import { UserController } from './user_controller';
import { userController } from '../configuration/app_config';
import { IncomingMessage, ServerResponse, RequestListener } from 'http';
import { ValidationError, UserNotFound } from '../error/validation_error';
import { validate as uuidValidate } from 'uuid';

const controller: UserController = userController;

function handleNotFound(req: IncomingMessage, res: ServerResponse) {
    console.log(`Path - [${req.url}] with method - [${req.method}] not found`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Not Found with Path - [${req.url}], method - [${req.method}]` }));
}

function handleInvalidUserId(req: IncomingMessage, res: ServerResponse, userId: string) {
    console.log(`Path - [${req.url}] with method - [${req.method}] is invalid`);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Invalid userId (not uuid) - [${userId}]` }));
}

function handleError(req: IncomingMessage, res: ServerResponse, err: any) {
    if (err instanceof ValidationError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message, errors: err.errors }));
        return;
    } else if (err instanceof UserNotFound) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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

async function handGetUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    try {
        const foundUser = await controller.geUser(userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(foundUser));
    } catch (err) {
        handleError(req, res, err);
    }
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

async function handleUpdateUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const userData = JSON.parse(body);
            const updatedUser = await controller.updateUser(userId, userData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } catch (err) {
            handleError(req, res, err);
        }
    });
}

export const requestListener: RequestListener = async (req: IncomingMessage, res: ServerResponse) => {

    req.on('error', err => {
        handleError(req, res, err);
    });


    const urlParts = req.url?.split('/').slice(1);
    const method = req.method;

    if (req.url === "/api/users") {
        if (method === "GET") {
            await handleGetUsers(res);
            return;
        } else if (method === 'POST') {
            await handleCreateUser(req, res);
            return;
        }
    } else if (urlParts && urlParts.length === 3 && req.url?.startsWith("/api/users/")) {
        let userId = urlParts[2]
        if (!uuidValidate(userId)) {
            handleInvalidUserId(req, res, userId);
            return;
        }

        switch (method) {
            case "GET":
                await handGetUser(req, res, userId);
                return;
            case "PUT":
                await handleUpdateUser(req, res, userId);
                return;
            case "DELETE":
            default:
                break;
        }
    }

    handleNotFound(req, res);
};