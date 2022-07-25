import dayjs from "dayjs";

import { DayJSDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemomry: CarsRepositoryInMemory;
let dayJSDateProvider: DayJSDateProvider;

describe("Create Rental", () => {
  const add24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemomry = new CarsRepositoryInMemory();
    dayJSDateProvider = new DayJSDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      dayJSDateProvider,
      rentalsRepositoryInMemory,
      carsRepositoryInMemomry
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemomry.create({
      name: "Carro teste",
      id: "123454abcd",
      description: "Carro para ser tetado",
      license_plate: "ABC1234",
      brand: "Test brand",
      fine_amount: 99,
      category_id: "123454abcd",
      daily_rate: 50,
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "4321",
      expect_return_date: add24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if this user already has an opened one", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "1234",
        user_id: "4321",
        expect_return_date: add24Hours,
      });

      const rental = await createRentalUseCase.execute({
        car_id: "1234",
        user_id: "4321",
        expect_return_date: add24Hours,
      });

      console.log(rental);

      expect(rental).toHaveProperty("id");
      expect(rental).toHaveProperty("start_date");
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if this car is already in use", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "teste1",
        user_id: "4321",
        expect_return_date: add24Hours,
      });

      const rental = await createRentalUseCase.execute({
        car_id: "teste1",
        user_id: "1234",
        expect_return_date: add24Hours,
      });

      expect(rental).toHaveProperty("id");
      expect(rental).toHaveProperty("start_date");
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if the return time is less than 24h", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "teste1",
        user_id: "4321",
        expect_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
