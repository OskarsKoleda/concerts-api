import { validateUserLogin } from "../../../src/RESTValidators/auth.validator";

const mockedValidUser = {
  email: "john@email.com",
  password: "Compl3xP@ssword",
};

describe("validateUserLogin should fail validation, when", () => {
  // EMAIL

  it("email is not a string", () => {
    const user = { ...mockedValidUser, email: 12345 };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Email must be a string");
  });

  it("email is not a valid email", () => {
    const user = { ...mockedValidUser, email: "not-an-email" };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Email must be a valid email address");
  });

  it("email is less than 5 characters", () => {
    const user = { ...mockedValidUser, email: "a@b" };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Email must be at least 5 characters");
  });

  it("email is more than 50 characters", () => {
    const user = { ...mockedValidUser, email: "a".repeat(51) + "@mail.com" };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Email must be at most 50 characters");
  });

  it("email is missing", () => {
    const { email, ...userWithoutEmail } = mockedValidUser;
    const { error } = validateUserLogin(userWithoutEmail as any);
    expect(error?.message).toBe("Email is required");
  });

  // PASSWORD

  it("password is not a string", () => {
    const user = { ...mockedValidUser, password: 123456 };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Password must be a string");
  });

  it("password is less than 6 characters", () => {
    const user = { ...mockedValidUser, password: "12345" };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Password must be at least 6 characters");
  });

  it("password is more than 1024 characters", () => {
    const user = { ...mockedValidUser, password: "a".repeat(1025) };
    const { error } = validateUserLogin(user as any);
    expect(error?.message).toBe("Password must be at most 1024 characters");
  });

  it("password is missing", () => {
    const { password, ...userWithoutPassword } = mockedValidUser;
    const { error } = validateUserLogin(userWithoutPassword as any);
    expect(error?.message).toBe("Password is required");
  });
});
