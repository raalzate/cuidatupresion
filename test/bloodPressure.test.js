import { isHypotensiveCrisis } from "../utils/bloodPressure.js";

describe("isHypotensiveCrisis", () => {
  test("should return true for systolic <= threshold (e.g. 90)", () => {
    expect(isHypotensiveCrisis(90, 80)).toBe(true);
    expect(isHypotensiveCrisis(85, 75)).toBe(true);
    expect(isHypotensiveCrisis(70, 90)).toBe(true);
  });

  test("should return true for diastolic <= threshold (e.g. 60)", () => {
    expect(isHypotensiveCrisis(100, 60)).toBe(true);
    expect(isHypotensiveCrisis(110, 55)).toBe(true);
    expect(isHypotensiveCrisis(95, 50)).toBe(true);
  });

  test("should return true when both systolic and diastolic are low", () => {
    expect(isHypotensiveCrisis(85, 55)).toBe(true);
    expect(isHypotensiveCrisis(70, 40)).toBe(true);
  });

  test("should return false for normal blood pressure", () => {
    expect(isHypotensiveCrisis(120, 80)).toBe(false);
    expect(isHypotensiveCrisis(110, 70)).toBe(false);
    expect(isHypotensiveCrisis(130, 85)).toBe(false);
  });

  test("should return false for high pressure levels", () => {
    expect(isHypotensiveCrisis(140, 90)).toBe(false);
    expect(isHypotensiveCrisis(150, 100)).toBe(false);
    expect(isHypotensiveCrisis(180, 110)).toBe(false);
  });

  test("should handle edge cases at threshold exactly", () => {
    expect(isHypotensiveCrisis(90, 70)).toBe(true); // sys == 90
    expect(isHypotensiveCrisis(100, 60)).toBe(true); // dias == 60
    expect(isHypotensiveCrisis(90, 60)).toBe(true); // both on threshold
  });

  test("should handle invalid inputs gracefully", () => {
    expect(isHypotensiveCrisis(null, 80)).toBe(false);
    expect(isHypotensiveCrisis(120, null)).toBe(false);
    expect(isHypotensiveCrisis(undefined, undefined)).toBe(false);
    expect(isHypotensiveCrisis("abc", "def")).toBe(false);
  });
});
