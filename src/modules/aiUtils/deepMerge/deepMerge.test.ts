import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it("should merge two simple objects", async () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = await deepMerge(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should deep merge nested objects", async () => {
    const obj1 = { a: { x: 1, y: 2 }, b: 3 };
    const obj2 = { a: { y: 5, z: 6 }, c: 7 };
    const result = await deepMerge(obj1, obj2);
    expect(result).toEqual({ a: { x: 1, y: 5, z: 6 }, b: 3, c: 7 });
  });
});
