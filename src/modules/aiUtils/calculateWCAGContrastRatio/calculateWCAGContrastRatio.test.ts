import { calculateWCAGContrastRatio } from "./calculateWCAGContrastRatio";

describe("calculateWCAGContrastRatio", () => {
  // Increase timeout for API calls
  jest.setTimeout(120000);

  it("should calculate contrast ratio for black and white", async () => {
    const result = await calculateWCAGContrastRatio("#000000", "#FFFFFF");
    expect(result).toBe(21);
  });

  it("should calculate contrast ratio for white and black (reversed)", async () => {
    const result = await calculateWCAGContrastRatio("#FFFFFF", "#000000");
    expect(result).toBe(21);
  });

  it("should calculate contrast ratio for red and white", async () => {
    const result = await calculateWCAGContrastRatio("#FF0000", "#FFFFFF");
    expect(result).toBeCloseTo(4, 0);
  });

  it("should calculate contrast ratio for green and black", async () => {
    const result = await calculateWCAGContrastRatio("#00FF00", "#000000");
    expect(result).toBeCloseTo(15.3, 0);
  });

  it("should calculate contrast ratio for blue and white", async () => {
    const result = await calculateWCAGContrastRatio("#0000FF", "#FFFFFF");
    expect(result).toBeCloseTo(8.59, 0);
  });

  it("should calculate contrast ratio for gray and white", async () => {
    const result = await calculateWCAGContrastRatio("#777777", "#FFFFFF");
    expect(result).toBeCloseTo(4.48, 1);
  });

  it("should calculate contrast ratio for light gray and black", async () => {
    const result = await calculateWCAGContrastRatio("#CCCCCC", "#000000");
    expect(result).toBeCloseTo(13.08, 0);
  });

  it("should calculate contrast ratio for dark gray and white", async () => {
    const result = await calculateWCAGContrastRatio("#333333", "#FFFFFF");
    expect(result).toBeCloseTo(12.63, 0);
  });

  it("should calculate AA Large minimum (3:1)", async () => {
    const result = await calculateWCAGContrastRatio("#767676", "#FFFFFF");
    expect(result).toBeCloseTo(4.54, 1);
  });

  it("should calculate AA Normal minimum (4.5:1)", async () => {
    const result = await calculateWCAGContrastRatio("#595959", "#FFFFFF");
    expect(result).toBeCloseTo(7, 0);
  });

  it("should calculate AAA Large minimum (4.5:1)", async () => {
    const result = await calculateWCAGContrastRatio("#4D4D4D", "#FFFFFF");
    expect(result).toBeCloseTo(8.45, 0);
  });

  it("should calculate AAA Normal minimum (7:1)", async () => {
    const result = await calculateWCAGContrastRatio("#3C3C3C", "#FFFFFF");
    expect(result).toBeCloseTo(11.03, 0);
  });

  it("should calculate Twitter blue and white", async () => {
    const result = await calculateWCAGContrastRatio("#1DA1F2", "#FFFFFF");
    expect(result).toBeCloseTo(2.83, 0);
  });

  it("should calculate Facebook blue and white", async () => {
    const result = await calculateWCAGContrastRatio("#4267B2", "#FFFFFF");
    expect(result).toBeCloseTo(5.51, 0);
  });

  it("should calculate Reddit orange and white", async () => {
    const result = await calculateWCAGContrastRatio("#FF5700", "#FFFFFF");
    expect(result).toBeCloseTo(3.17, 0);
  });
});
