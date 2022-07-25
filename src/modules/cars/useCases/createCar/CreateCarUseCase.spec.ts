import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it("should be able to create a new car registration", async () => {
    const car = await createCarUseCase.execute({
      name: "Teste",
      description: "Description teste",
      daily_rate: 123,
      license_plate: "abc1234",
      fine_amount: 60,
      brand: "Brantest",
      category_id: "categorytestid",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with existent license plate", () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Car1",
        description: "Description teste",
        daily_rate: 123,
        license_plate: "abc1234",
        fine_amount: 60,
        brand: "Brantest",
        category_id: "categorytestid",
      });

      await createCarUseCase.execute({
        name: "Car2",
        description: "Description teste",
        daily_rate: 123,
        license_plate: "abc1234",
        fine_amount: 60,
        brand: "Brantest",
        category_id: "categorytestid",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a car with availability true", async () => {
    const car = await createCarUseCase.execute({
      name: "Car",
      description: "Description teste",
      daily_rate: 123,
      license_plate: "abc1234",
      fine_amount: 60,
      brand: "Brantest",
      category_id: "categorytestid",
    });
    expect(car.available).toBe(true);
  });
});
