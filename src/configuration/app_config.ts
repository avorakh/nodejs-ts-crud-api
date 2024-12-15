import { UserRepository } from "../repository/user_repository";
import { InMemoryUserRepository } from "../repository/in_memory_db_user_repository";
import { IncomingMessage, ServerResponse, RequestListener } from "http";
import { RequestHandler } from "../controller/request_handler";
import { sendJsonResponse } from "../utils/request_utils";
import { UsersController, UserController } from "../controller/user_controller";

const userRepository: UserRepository = new InMemoryUserRepository();

const requestHandlers: RequestHandler[] = [
  new UsersController(userRepository),
  new UserController(userRepository),
];

function findFirstHandler(
  handlers: RequestHandler[],
  req: IncomingMessage,
): RequestHandler | undefined {
  return handlers.find((handler) => handler.canHandle(req));
}

export const requestListener: RequestListener = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const handler = findFirstHandler(requestHandlers, req);
  if (handler) {
    await handler.handle(req, res);
  } else {
    console.log(`Path - [${req.url}] with method - [${req.method}] not found`);
    sendJsonResponse(res, 404, {
      error: `Not Found with Path - [${req.url}], method - [${req.method}]`,
    });
  }
};
