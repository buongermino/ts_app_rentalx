import { DayJSDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { EmailProviderInMemory } from "../../../../shared/container/providers/MailProvider/in-memory/EmailProviderInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";

let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJSDateProvider;
let emailProvider: EmailProviderInMemory;

describe("Send forgot email", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayJSDateProvider();
    emailProvider = new EmailProviderInMemory();
    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      emailProvider
    );
  });

  it("should be able to send a forgot password email to user", async () => {
    const sendMail = jest.spyOn(emailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      name: "Nome teste",
      email: "teste@mail.com",
      password: "12345",
      driver_license: "0090876",
    });

    await sendForgotPasswordEmailUseCase.execute("teste@mail.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("shold not be able to send an email to a non-existing user", async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute("emailquenaoexiste@gmail.com")
    ).rejects.toEqual(new AppError("User doesn't exists"));
  });

  it("should be able to create a new users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      name: "Nome teste2",
      email: "teste2@mail.com",
      password: "123451",
      driver_license: "0090876ce",
    });

    await sendForgotPasswordEmailUseCase.execute("teste2@mail.com");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
