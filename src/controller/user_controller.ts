import { UserRepository } from "../repository/user_repository";
import { User } from "../entity/user";
import { ValidationError, UserNotFound } from "../error/validation_error";

interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export class UserController {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.repository.getAll();
  }

  async geUser(userId: string): Promise<User> {
    const foundUser = await this.repository.getUserById(userId);
    if (!foundUser) {
      throw new UserNotFound(userId);
    }

    return foundUser;
  }

  async createUser(data: UserInput): Promise<User> {
    validateUserInput(data);
    let userToCreate = convertToUser(data);
    return await this.repository.createOrUpdate(userToCreate);
  }

  async updateUser(userId: string, data: UserInput): Promise<User> {
    validateUserInput(data);
    const foundUser = await this.repository.getUserById(userId);

    if (!foundUser) {
      throw new UserNotFound(userId);
    }

    return await this.repository.createOrUpdate(updateUser(userId, data));
  }

  async deleteUser(userId: string): Promise<void> {
    const foundUser = await this.repository.getUserById(userId);

    if (!foundUser) {
      throw new UserNotFound(userId);
    }

    await this.repository.deleteUserById(userId);
  }
}

function convertToUser(userInput: UserInput): User {
  const { username, age, hobbies } = userInput;
  return new User(username, age, hobbies);
}

function updateUser(id: string, serInput: UserInput) {
  let updatedUser = convertToUser(serInput);

  updatedUser.id = id;
  return updatedUser;
}

function validateUserInput(input: UserInput): void {
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
