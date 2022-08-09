import { instanceToInstance } from "class-transformer/";

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
  static toDTO({
    name,
    email,
    id,
    driver_license,
    avatar,
    avatarUrl,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      name,
      email,
      id,
      driver_license,
      avatar,
      avatarUrl,
    });

    return user;
  }
}

export { UserMap };
