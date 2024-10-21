import { IncomingMessage, ServerResponse } from "http";
import { UserRepository } from "../repository/user_repository";
import { User } from "../entity/user";
import {
  ValidationError,
  UserNotFoundError,
  InvalidUserIdError,
} from "../error/validation_error";
import { sendJsonResponse } from "../utils/request_utils";

interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export interface RequestHandler {
  canHandle(req: IncomingMessage): boolean;
  handle(req: IncomingMessage, res: ServerResponse): Promise<void>;
}

export abstract class AbstractUserController implements RequestHandler {
  protected repository: UserRepository;
  private supportedMethods: string[];

  constructor(repository: UserRepository, supportedMethods: string[]) {
    this.repository = repository;
    this.supportedMethods = supportedMethods;
  }

  canHandle(req: IncomingMessage): boolean {
    return this.isSupportedPath(req.url) && this.isSupportedMethod(req.method);
  }

  abstract handle(req: IncomingMessage, res: ServerResponse): Promise<void>;

  isSupportedMethod(method: string | undefined): boolean {
    return method ? this.supportedMethods.includes(method) : false;
  }

  abstract isSupportedPath(requestPath: string | undefined): boolean;

  async handleError(
    req: IncomingMessage,
    res: ServerResponse,
    err: any,
  ): Promise<void> {
    if (err instanceof ValidationError) {
      sendJsonResponse(res, 400, { error: err.message, errors: err.errors });
      return;
    } else if (err instanceof UserNotFoundError) {
      sendJsonResponse(res, 404, { error: err.message });
      return;
    } else if (err instanceof InvalidUserIdError) {
      sendJsonResponse(res, 400, { error: err.message });
      return;
    }

    console.log(`Unexpected error - [${err.message}]`);
    sendJsonResponse(res, 500, {
      error: `Unexpected error- - [${err.message}]`,
    });
  }
}

export function validateUserInput(input: UserInput): void {
  const errors: string[] = [];

  if (typeof input.username !== "string" || !input.username.trim()) {
    errors.push("Username is required and must be a non-empty string.");
  }

  if (typeof input.age !== "number" || isNaN(input.age)) {
    errors.push("Age is required and must be a number.");
  }

  if (!Array.isArray(input.hobbies)) {
    errors.push("Hobbies is required and must be an array.");
  } else if (!input.hobbies.every((hobby) => typeof hobby === "string")) {
    errors.push("All hobbies must be strings.");
  }

  if (errors.length > 0) {
    throw new ValidationError("User input validation failed", errors);
  }
}

export function convertToUser(userInput: UserInput): User {
  const { username, age, hobbies } = userInput;
  return new User(username, age, hobbies);
}
