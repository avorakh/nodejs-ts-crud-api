import { IncomingMessage, ServerResponse } from "http";
import {
  AbstractUserController,
  validateUserInput,
  convertToUser,
} from "./request_handler";
import { UserRepository } from "../repository/user_repository";
import { parseRequestBody, sendJsonResponse } from "../utils/request_utils";
import { validate as uuidValidate } from "uuid";
import {
  UserNotFoundError,
  InvalidUserIdError,
} from "../error/validation_error";
import { User } from "../entity/user";

export class UsersController extends AbstractUserController {
  constructor(repository: UserRepository) {
    super(repository, ["GET", "POST"]);
  }

  isSupportedPath(requestPath: string | undefined): boolean {
    return requestPath ? requestPath === "/api/users" : false;
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let method = req.method;

    if (!method) {
      throw new Error("unexpected behavior");
    }

    if (method === "POST") {
      await this.handleCreateUser(req, res);
      return;
    } else if (method === "GET") {
      await this.handleGetUsers(req, res);
      return;
    }
    throw new Error("unexpected behavior");
  }

  async handleGetUsers(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    let foundUsers = await this.repository.getAll();
    sendJsonResponse(res, 200, foundUsers);
  }

  async handleCreateUser(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      let newUserData = await parseRequestBody(req);
      validateUserInput(newUserData);
      let newUser = convertToUser(newUserData);
      await this.repository.createOrUpdate(newUser);
      sendJsonResponse(res, 201, newUser);
    } catch (err) {
      console.error(err);
      await this.handleError(req, res, err);
    }
  }
}

export class UserController extends AbstractUserController {
  constructor(repository: UserRepository) {
    super(repository, ["GET", "PUT", "DELETE"]);
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      let userId = this.extractUserId(req);
      let method = req.method;

      if (!method) {
        throw new Error("unexpected behavior");
      }
      if (method === "GET") {
        await this.handGetUser(req, res, userId);
        return;
      } else if (method === "PUT") {
        await this.handleUpdateUser(req, res, userId);
        return;
      } else if (method === "DELETE") {
        await this.handleDeleteUser(req, res, userId);
        return;
      }
      throw new Error("Method not implemented.");
    } catch (err) {
      await this.handleError(req, res, err);
    }
  }

  isSupportedPath(requestPath: string | undefined): boolean {
    const urlParts = requestPath?.split("/").slice(1);
    return requestPath
      ? this.isUserPath(requestPath) && this.isContainUserId(requestPath)
      : false;
  }

  private isUserPath(requestPath: string): boolean {
    return requestPath.startsWith("/api/users/");
  }

  private isContainUserId(requestPath: string): boolean {
    const urlParts = requestPath?.split("/").slice(1);
    return urlParts.length === 3;
  }

  private extractUserId(req: IncomingMessage): string {
    const urlParts = req.url?.split("/").slice(1);
    if (!urlParts || (urlParts && urlParts.length !== 3)) {
      throw new Error("unexpected behavior");
    }
    let userId = urlParts[2];
    if (!uuidValidate(userId)) {
      throw new InvalidUserIdError(userId);
    }

    return userId;
  }

  async handGetUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    let foundUser = await this.findUser(userId);
    sendJsonResponse(res, 200, foundUser);
  }

  private async findUser(userId: string): Promise<User> {
    const foundUser = await this.repository.getUserById(userId);
    if (!foundUser) {
      throw new UserNotFoundError(userId);
    }
    return foundUser;
  }

  async handleDeleteUser(
    req: IncomingMessage,
    res: ServerResponse,
    userId: string,
  ) {
    await this.findUser(userId);
    await this.repository.deleteUserById(userId);
    sendJsonResponse(res, 204, undefined);
  }

  async handleUpdateUser(
    req: IncomingMessage,
    res: ServerResponse,
    userId: string,
  ) {
    await this.findUser(userId);
    let updatUserData = await parseRequestBody(req);
    validateUserInput(updatUserData);
    let updatedUser = convertToUser(updatUserData);
    updatedUser.id = userId;
    await this.repository.createOrUpdate(updatedUser);
    sendJsonResponse(res, 200, updatedUser);
  }
}
