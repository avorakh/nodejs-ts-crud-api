import { UserRepository } from '../repository/user_repository';
import { User } from '../entity/user';

export class UserController {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async getAllUsers(): Promise<User[]> {
        return  await this.repository.getAll();
    }
}