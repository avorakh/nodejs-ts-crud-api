import { UserRepository } from '../repository/user_repository';
import { InMemoryUserRepository } from '../repository/in_memory_db_user_repository';
import { UserController } from '../controller/user_controller';

const userRepository: UserRepository = new InMemoryUserRepository();

export const userController: UserController = new UserController(userRepository);