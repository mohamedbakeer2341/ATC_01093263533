import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(() => "mock.jwt.token"),
    verify: jest.fn(() => ({ userId: "123", email: "test@example.com" })),
  },
}));

const jwt = await import("jsonwebtoken");
const { generateToken, verifyToken } = await import("../utils/jwt.js");

const mockToken = "mock.jwt.token";
const mockPayload = { userId: "123", email: "test@example.com" };

describe("JWT Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should generate a valid token", () => {
    const token = generateToken(mockPayload);
    expect(token).toBe(mockToken);
    expect(jwt.default.sign).toHaveBeenCalledWith(
      mockPayload,
      expect.any(String),
      {
        expiresIn: "24h",
      }
    );
  });

  test("should verify a valid token", () => {
    const decoded = verifyToken(mockToken);
    expect(decoded).toEqual(mockPayload);
    expect(jwt.default.verify).toHaveBeenCalledWith(
      mockToken,
      expect.any(String)
    );
  });

  test("should throw error for invalid token", () => {
    jwt.default.verify.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });
    expect(() => verifyToken(mockToken)).toThrow("Invalid token");
  });
});
