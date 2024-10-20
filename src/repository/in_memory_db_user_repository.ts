import { User } from '../entity/user';
import { UserRepository } from './user_repository';
import { InMemoryDb } from './../db/database';

export class InMemoryUserRepository implements UserRepository {
  private db: InMemoryDb<User>;

  constructor() {
    this.db = new InMemoryDb<User>();
    let user = new User("name", 50, [])
    this.db.create(user.id, user);
  }

  async getAll(): Promise<User[]> {
    return this.db.readAll();
  }
  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.read(id);
  }

  async create(newUser: User): Promise<User> {
    await this.db.create(newUser.id, newUser)
    return newUser;
  }
}