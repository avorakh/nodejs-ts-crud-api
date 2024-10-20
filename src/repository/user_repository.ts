import { User } from '../entity/user';

export interface UserRepository {
  getAll(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  create(newUser: User): Promise<User>;
}
