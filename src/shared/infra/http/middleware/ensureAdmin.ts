import { Response, NextFunction, Request } from "express";

import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // console.log(request.user);
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);
  // console.log(user);

  if (!user.isAdmin) {
    throw new AppError("User is not an admin", 401);
  }

  return next();
}
