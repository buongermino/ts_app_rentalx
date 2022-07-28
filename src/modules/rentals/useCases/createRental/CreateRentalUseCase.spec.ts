import dayjs from "dayjs";

import { DayJSDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJSDateProvider: DayJSDateProvider;

describe("Create Rental", () => {
  const add24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJSDateProvider = new DayJSDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      dayJSDateProvider,
      rentalsRepositoryInMemory,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
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
    rentalsRepositoryInMemory.create({
      car_id: "1234",
      expect_return_date: add24Hours,
      user_id: "usuario1",
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "12345",
        user_id: "usuario1",
        expect_return_date: add24Hours,
      })
    ).rejects.toEqual(new AppError("User already has a rental"));
  });

  it("should not be able to create a new rental if this car is already in use", async () => {
    rentalsRepositoryInMemory.create({
      car_id: "carro_alugado1",
      expect_return_date: add24Hours,
      user_id: "usuario1",
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "carro_alugado1",
        user_id: "usuario2",
        expect_return_date: add24Hours,
      })
    ).rejects.toEqual(new AppError("Car unavailable"));
  });

  it("should not be able to create a new rental if the return time is less than 24h", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "teste1",
        user_id: "4321",
        expect_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(
      new AppError("Minimum return time not reached (min at least 24h)")
    );
  });
});
