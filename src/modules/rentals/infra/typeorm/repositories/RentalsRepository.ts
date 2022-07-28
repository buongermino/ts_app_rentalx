import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateRentalDTO } from "../../../dtos/ICreateRentalDTO";
import { IRentalsRepository } from "../../../repositories/IRentalsRepository";
import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = dataSource.getRepository(Rental);
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ["car"],
    });
    return rentals;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOneBy({ id });
    return rental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rentalByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });
    return rentalByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rentalByUser = await this.repository.findOne({
      where: { user_id, end_date: null },
    });
    return rentalByUser;
  }

  async create({
    car_id,
    user_id,
    expect_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expect_return_date,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);
    return rental;
  }
}

export { RentalsRepository };
