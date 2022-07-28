import { ICreateUserTokenDTO } from "modules/accounts/dtos/ICreateUserTokenDTO";

import { UserTokens } from "../../infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  userTokens: UserTokens[] = [];

  async create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userTokens = new UserTokens();

    Object.assign(userTokens, {
      user_id,
      expiration_date,
      refresh_token,
    });

    this.userTokens.push(userTokens);

    return userTokens;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = this.userTokens.find(
      (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
    );
    return userToken;
  }

  async findUserByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.userTokens.find(
      (ut) => ut.refresh_token === refresh_token
    );
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.findIndex((ut) => ut.id === id);
    this.userTokens.splice(userToken, 1);
  }
}

export { UsersTokensRepositoryInMemory };
