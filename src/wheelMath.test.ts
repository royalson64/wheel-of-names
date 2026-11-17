import { getTargetRotation, nextSpinRotation } from "./wheelMath";

describe("wheelMath", () => {
  it("lands the pointer on the center of the chosen slice", () => {
    expect(getTargetRotation(0, 6)).toBeCloseTo(330);
    expect(getTargetRotation(1, 6)).toBeCloseTo(270);
  });

  it("adds full spins without snapping back to zero", () => {
    const next = nextSpinRotation(1980, 2, 6, 5);
    expect(next).toBeGreaterThan(1980);
    expect(next % 360).toBeCloseTo(getTargetRotation(2, 6));
  });
});
