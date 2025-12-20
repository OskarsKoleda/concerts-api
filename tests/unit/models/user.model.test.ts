import { UserModel } from "../../../src/models/user/user.model";

const mockedUser = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  password: "securePassword123",
};

describe("userSchema should throw a validation error, when", () => {
  // NAME
  it("name is missing", async () => {
    const { name, ...userWithoutName } = mockedUser;
    const user = new UserModel(userWithoutName);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: name: Path `name` is required."
    );
  });

  it("name is shorter than 2 characters", async () => {
    const user = new UserModel({ ...mockedUser, name: "A" });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: name: Path `name` (`A`) is shorter than the minimum allowed length (2)."
    );
  });

  it("name is longer than 50 characters", async () => {
    const longName = "N".repeat(51);
    const user = new UserModel({ ...mockedUser, name: longName });

    await expect(user.save()).rejects.toThrow(
      `User validation failed: name: Path \`name\` (\`${longName}\`) is longer than the maximum allowed length (50).`
    );
  });

  // AGE
  it("age is missing", async () => {
    const { age, ...userWithoutAge } = mockedUser;
    const user = new UserModel(userWithoutAge);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: age: Path `age` is required."
    );
  });

  it("age is less than 1", async () => {
    const user = new UserModel({ ...mockedUser, age: 0 });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: age: Path `age` (0) is less than minimum allowed value (1)."
    );
  });

  it("age is greater than 120", async () => {
    const user = new UserModel({ ...mockedUser, age: 121 });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: age: Path `age` (121) is more than maximum allowed value (120)."
    );
  });

  it("age is not an integer", async () => {
    const user = new UserModel({ ...mockedUser, age: 25.5 });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: age: 25.5 is not an integer value"
    );
  });

  // EMAIL
  it("email is missing", async () => {
    const { email, ...userWithoutEmail } = mockedUser;
    const user = new UserModel(userWithoutEmail);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: email: Path `email` is required."
    );
  });

  it("email is shorter than 5 characters", async () => {
    const user = new UserModel({ ...mockedUser, email: "a@b" });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: email: Path `email` (`a@b`) is shorter than the minimum allowed length (5)."
    );
  });

  it("email is longer than 50 characters", async () => {
    const longEmail = "a".repeat(41) + "@example.com";
    const user = new UserModel({ ...mockedUser, email: longEmail });

    await expect(user.save()).rejects.toThrow(
      `User validation failed: email: Path \`email\` (\`${longEmail}\`) is longer than the maximum allowed length (50).`
    );
  });

  // PASSWORD
  it("password is missing", async () => {
    const { password, ...userWithoutPassword } = mockedUser;
    const user = new UserModel(userWithoutPassword);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: password: Path `password` is required."
    );
  });

  it("password is shorter than 6 characters", async () => {
    const user = new UserModel({ ...mockedUser, password: "12345" });

    await expect(user.save()).rejects.toThrow(
      "User validation failed: password: Path `password` (`12345`) is shorter than the minimum allowed length (6)."
    );
  });

  it("password is longer than 1024 characters", async () => {
    const longPassword = "p".repeat(1025);
    const user = new UserModel({ ...mockedUser, password: longPassword });

    await expect(user.save()).rejects.toThrow(
      `User validation failed: password: Path \`password\` (\`${longPassword}\`) is longer than the maximum allowed length (1024).`
    );
  });
});
