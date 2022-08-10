import { DataSource } from "typeorm";

import { User } from "../../../modules/accounts/infra/typeorm/entities/User";
import { UserTokens } from "../../../modules/accounts/infra/typeorm/entities/UserTokens";
import { Car } from "../../../modules/cars/infra/typeorm/entities/Car";
import { CarImage } from "../../../modules/cars/infra/typeorm/entities/CarImage";
import { Category } from "../../../modules/cars/infra/typeorm/entities/Category";
import { Specification } from "../../../modules/cars/infra/typeorm/entities/Specification";
import { Rental } from "../../../modules/rentals/infra/typeorm/entities/Rental";
import { CreateCategories1654091465414 } from "./migrations/1654091465414-CreateCategories";
import { CreateSpecifications1654221522212 } from "./migrations/1654221522212-CreateSpecifications";
import { CreateUsers1654292328548 } from "./migrations/1654292328548-CreateUsers";
import { AlterUserAddAvatar1654639299150 } from "./migrations/1654639299150-AlterUserAddAvatar";
import { CreateCars1655563716699 } from "./migrations/1655563716699-CreateCars";
import { CreateSpecificatiosCars1656373372687 } from "./migrations/1656373372687-CreateSpecificatiosCars";
import { CreateCarImages1656510684459 } from "./migrations/1656510684459-CreateCarImages";
import { CreateRentals1656598885861 } from "./migrations/1656598885861-CreateRentals";
import { CreateUsersToken1658323326789 } from "./migrations/1658323326789-CreateUsersToken";

const dataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "docker",
  password: "ignite",
  database: process.env.NODE_ENV === "test" ? "rentx_test" : "rentx",
  entities: [User, UserTokens, Car, CarImage, Category, Specification, Rental],
  migrations: [
    CreateCategories1654091465414,
    CreateSpecifications1654221522212,
    CreateUsers1654292328548,
    AlterUserAddAvatar1654639299150,
    CreateCars1655563716699,
    CreateSpecificatiosCars1656373372687,
    CreateCarImages1656510684459,
    CreateRentals1656598885861,
    CreateUsersToken1658323326789,
  ],
});

export function createConnection(): Promise<DataSource> {
  return dataSource.initialize();
}

export { dataSource };
