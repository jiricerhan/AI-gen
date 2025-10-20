import { divide } from "./divide";

describe("divide", () => {
  it("should return 5 when dividing 10 by 2", async () => {
    const result = await divide(10, 2);
    expect(result).toBe(5);
  });

  it("should return 2.5 when dividing 5 by 2", async () => {
    const result = await divide(5, 2);
    expect(result).toBe(2.5);
  });
});
