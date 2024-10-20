import { User } from '../entity/user';

export interface UserRepository {
  getAll(): Promise<User[]>;
}
