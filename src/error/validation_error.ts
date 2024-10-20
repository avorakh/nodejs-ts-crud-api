export class ValidationError extends Error {
  public errors: string[];

  constructor(message: string, errors: string[]) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export class UserNotFound extends Error {
  constructor(userId: string) {
    super(`User not found with Id - [${userId}]`);
    this.name = "UserNotFound";
  }
}
