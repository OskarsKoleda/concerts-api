import { validateUser } from "../../../src/RESTValidators/user.validator";

const mockedValidUser = {
  name: "John",
  email: "john@email.com",
  age: 30,
  password: "Compl3xP@ssword",
  repeatPassword: "Compl3xP@ssword",
};

describe("validateUser should fail validation, when", () => {
  // NAME
  it("name is not a string", () => {
    const user = { ...mockedValidUser, name: 1 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Name must be a string");
  });

  it("name is less than 2 characters", () => {
    const user = { ...mockedValidUser, name: "J" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Name must be at least 2 characters");
  });

  it("name is more than 50 characters", () => {
    const user = { ...mockedValidUser, name: "a".repeat(51) };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Name must be at most 50 characters");
  });

  it("name is missing", () => {
    const { name, ...userWithoutName } = mockedValidUser;
    const { error } = validateUser(userWithoutName as any);
    expect(error?.message).toBe("Name is required");
  });

  // EMAIL
  it("email is not a string", () => {
    const user = { ...mockedValidUser, email: 12345 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Email must be a string");
  });

  it("email is not a valid email", () => {
    const user = { ...mockedValidUser, email: "not-an-email" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Email must be a valid email address");
  });

  it("email is less than 5 characters", () => {
    const user = { ...mockedValidUser, email: "a@b" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Email must be at least 5 characters");
  });

  it("email is more than 50 characters", () => {
    const user = { ...mockedValidUser, email: "a".repeat(51) + "@mail.com" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Email must be at most 50 characters");
  });

  it("email is missing", () => {
    const { email, ...userWithoutEmail } = mockedValidUser;
    const { error } = validateUser(userWithoutEmail as any);
    expect(error?.message).toBe("Email is required");
  });

  // AGE
  it("age is not a number", () => {
    const user = { ...mockedValidUser, age: "twenty" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Age must be a number");
  });

  it("age is not an integer", () => {
    const user = { ...mockedValidUser, age: 25.5 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Age must be an integer");
  });

  it("age is less than 1", () => {
    const user = { ...mockedValidUser, age: 0 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Age must be at least 1");
  });

  it("age is more than 120", () => {
    const user = { ...mockedValidUser, age: 121 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Age must be at most 120");
  });

  it("age is missing", () => {
    const { age, ...userWithoutAge } = mockedValidUser;
    const { error } = validateUser(userWithoutAge as any);
    expect(error?.message).toBe("Age is required");
  });

  // PASSWORD
  it("password is not a string", () => {
    const user = { ...mockedValidUser, password: 123456 };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Password must be a string");
  });

  it("password is less than 6 characters", () => {
    const user = { ...mockedValidUser, password: "12345" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Password must be at least 6 characters");
  });

  it("password is more than 1024 characters", () => {
    const user = { ...mockedValidUser, password: "a".repeat(1025) };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Password must be at most 1024 characters");
  });

  it("password is missing", () => {
    const { password, ...userWithoutPassword } = mockedValidUser;
    const { error } = validateUser(userWithoutPassword as any);
    expect(error?.message).toBe("Password is required");
  });

  // REPEAT PASSWORD
  it("repeatPassword is not a matching password", () => {
    const user = { ...mockedValidUser, repeatPassword: "differentPassword" };
    const { error } = validateUser(user as any);
    expect(error?.message).toBe("Passwords do not match");
  });
});
