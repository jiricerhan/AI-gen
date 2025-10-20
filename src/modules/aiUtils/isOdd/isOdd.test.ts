import { isOdd } from "./isOdd";

describe("isOdd", () => {
  it("should return true for odd number 3", async () => {
    const result = await isOdd(3);
    expect(result).toBe(true);
  });

  it("should return false for even number 4", async () => {
    const result = await isOdd(4);
    expect(result).toBe(false);
  });
});
