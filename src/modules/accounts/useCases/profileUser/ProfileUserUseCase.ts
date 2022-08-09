import { IUserResponseDTO } from "modules/accounts/dtos/IUserResponseDTO";
import { inject, injectable } from "tsyringe";

// import { User } from "../../infra/typeorm/entities/User";
import { UserMap } from "../../mappers/UserMap";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class ProfileUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id);

    return UserMap.toDTO(user);
  }
}

export { ProfileUserUseCase };
