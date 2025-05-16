import { jest } from "@jest/globals";

const originalEnv = { ...process.env };

const mockedSalt = "mockedSalt";
const mockedHash = "mockedHash";
const testPassword = "testPassword";

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    genSalt: jest.fn(() => mockedSalt),
    hash: jest.fn(() => mockedHash),
    compare: jest.fn(() => true),
  },
}));

const bcrypt = await import("bcryptjs");
const { hashPassword, comparePassword } = await import("../utils/password.js");

describe("Password Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  test("should generate a salt and hash password correctly", async () => {
    const salt = await bcrypt.default.genSalt(expect.any(Number));
    expect(salt).toBe(mockedSalt);

    const hashedPassword = await hashPassword(testPassword);
    expect(hashedPassword).toBe(mockedHash);

    expect(bcrypt.default.hash).toHaveBeenCalledWith(testPassword, mockedSalt);
  });

  test("should compare passwords correctly", async () => {
    const result = await bcrypt.default.compare(testPassword, mockedHash);
    expect(result).toBe(true);
    expect(bcrypt.default.compare).toHaveBeenCalledWith(
      testPassword,
      mockedHash
    );
  });

  test("should return false if passwords do not match", async () => {
    bcrypt.default.compare.mockImplementationOnce(() => false);
    const result = await bcrypt.default.compare("wrong password", mockedHash);
    expect(result).toBe(false);
  });

  test("should handle missing SALT_ROUNDS environment variable", async () => {
    delete process.env.SALT_ROUNDS;
    const hashedPassword = await hashPassword(testPassword);
    expect(hashedPassword).toBe(mockedHash);
  });
});
