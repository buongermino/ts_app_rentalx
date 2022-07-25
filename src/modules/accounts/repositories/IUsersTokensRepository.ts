import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;

  findUserByRefreshToken(refresh_token: string): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;
}

export { IUsersTokensRepository };
