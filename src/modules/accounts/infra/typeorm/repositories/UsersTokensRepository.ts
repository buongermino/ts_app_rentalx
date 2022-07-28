import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateUserTokenDTO } from "../../../dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "../../../repositories/IUsersTokensRepository";
import { UserTokens } from "../entities/UserTokens";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = dataSource.getRepository(UserTokens);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expiration_date,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const usersTokens = await this.repository.findOneBy({
      user_id,
      refresh_token,
    });
    return usersTokens;
  }

  async findUserByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOneBy({ refresh_token });
    return userToken;
  }
}

export { UsersTokensRepository };
