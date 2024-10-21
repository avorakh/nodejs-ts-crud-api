import { User } from "../entity/user";
import { UserRepository } from "./user_repository";
import { InMemoryDb } from "./../db/database";

export class InMemoryUserRepository implements UserRepository {
  private db: InMemoryDb<User>;

  constructor() {
    this.db = new InMemoryDb<User>();
  }

  async getAll(): Promise<User[]> {
    return await this.db.readAll();
  }
  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.read(id);
  }

  async createOrUpdate(newUser: User): Promise<User> {
    await this.db.createOrUpdate(newUser.id, newUser);
    return newUser;
  }
  async deleteUserById(id: string): Promise<void> {
    await this.db.delete(id);
  }
}
