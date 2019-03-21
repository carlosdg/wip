import Pixel from "../Pixel";

describe("Pixel", () => {
  describe("Getters", () => {
    let values;
    let transparency;
    let extraInfo;
    let uut;

    beforeEach(() => {
      values = [100, 120, 240];
      transparency = 1;
      extraInfo = { a: "some extra info" };
      uut = new Pixel(values, transparency, extraInfo);
    });

    test("Should be able to get values", () => {
      expect(uut.values).toEqual(values);
    });

    test("Should be able to get transparency", () => {
      expect(uut.transparency).toEqual(transparency);
    });

    test("Should be able to get extra info", () => {
      expect(uut.maybeExtraInfo).toEqual(extraInfo);
    });
  });

  describe("Setters", () => {
    let values;
    let transparency;
    let extraInfo;
    let uut;

    beforeEach(() => {
      values = [100, 120, 240];
      transparency = 1;
      extraInfo = { a: "some extra info" };
      uut = new Pixel(values, transparency, extraInfo);
    });

    test("Should be able to set positive values", () => {
      const newValues = [0, 20, 3000];
      uut.setValues(newValues);
      expect(uut.values).toEqual(newValues);
    });

    test("Should be able to set negative large values", () => {
      const newValues = [-1000, -2121, -3];
      uut.setValues(newValues);
      expect(uut.values).toEqual(newValues);
    });

    test("Should be able to set more than 3 values", () => {
      const newValues = [1, 12, 312, 7];
      uut.setValues(newValues);
      expect(uut.values).toEqual(newValues);
    });

    test("Should be able to set less than 3 values", () => {
      const newValues = [1];
      uut.setValues(newValues);
      expect(uut.values).toEqual(newValues);
    });

    test("Should not be able to set no values", () => {
      expect(() => {
        uut.setValues([]);
      }).toThrowError(/invalid empty value/i);
    });

    test("Should not be able to set null value", () => {
      expect(() => {
        uut.setValues(null);
      }).toThrowError(/invalid empty value/i);
    });

    test("Should be able to set transparency", () => {
      const newTransparency = 0.5;
      uut.setTransparency(newTransparency);
      expect(uut.transparency).toEqual(newTransparency);
    });

    test("Should throw with transparency < 0", () => {
      const newTransparency = -0.1;
      expect(() => {
        uut.setTransparency(newTransparency);
      }).toThrowError(/invalid transparency/i);
    });

    test("Should throw with transparency > 1", () => {
      const newTransparency = 1.2;
      expect(() => {
        uut.setTransparency(newTransparency);
      }).toThrowError(/invalid transparency/i);
    });

    test("Should be able to set transparency to 0", () => {
      const newTransparency = 0;
      uut.setTransparency(newTransparency);
      expect(uut.transparency).toEqual(newTransparency);
    });

    test("Should be able to set transparency to 1", () => {
      const newTransparency = 1;
      uut.setTransparency(newTransparency);
      expect(uut.transparency).toEqual(newTransparency);
    });
  });

  describe("Clone", () => {
    let values;
    let transparency;
    let extraInfo;
    let originalPixel;
    let uut;

    beforeEach(() => {
      values = [100, 120, 240];
      transparency = 1;
      extraInfo = { a: "some extra info" };
      originalPixel = new Pixel(values, transparency, extraInfo);
      uut = originalPixel.clone();
    });

    test("Should have same values", () => {
      expect(uut.values).toEqual(originalPixel.values);
    });

    test("Should have same transparency", () => {
      expect(uut.transparency).toEqual(originalPixel.transparency);
    });

    test("Should have same extra info", () => {
      expect(uut.maybeExtraInfo).toEqual(originalPixel.maybeExtraInfo);
    });

    test("Should not change when original values change", () => {
      const prevValues = uut.values;
      const newValues = [1, 2, 3];
      originalPixel.setValues(newValues);
      expect(uut.values).not.toEqual(newValues);
      expect(uut.values).toEqual(prevValues);
      expect(originalPixel.values).toEqual(newValues);
    });

    test("Should not change when original transparency change", () => {
      const prevTransparency = uut.transparency;
      const newTransparency = 0.12;
      originalPixel.setTransparency(newTransparency);
      expect(uut.transparency).not.toEqual(newTransparency);
      expect(uut.transparency).toEqual(prevTransparency);
      expect(originalPixel.transparency).toEqual(newTransparency);
    });
  });

  describe("Operations", () => {
    let values;
    let transparency;
    let extraInfo;
    let uut;

    beforeEach(() => {
      values = [100, 120, 240];
      transparency = 1;
      extraInfo = { a: "some extra info" };
      uut = new Pixel(values, transparency, extraInfo);
    });

    test("eachDim", () => {
      const callback = value => value * 2;
      const expectedNewValues = values.map(callback);
      uut.eachDim(callback);
      expect(uut.values).toEqual(expectedNewValues);
    });

    test("allDims", () => {
      const callback = (a, b, c) => [a + b + c, b + c, c];
      const expectedNewValues = callback(values);
      uut.allDims(callback);
      expect(uut.values).toEqual(expectedNewValues);
    });

    test("combineEachDim", () => {
      const callback = ([a1, a2]) => a1 + a2;
      const expectedNewValues = values.map(value => 2 * value);
      uut.combineEachDim(uut, callback);
      expect(uut.values).toEqual(expectedNewValues);
    });

    test("combineAllDims", () => {
      const callback = ([[a1, a2], [b1, b2], [c1, c2]]) => [
        a1 + a2,
        b1 + b2 + c1,
        c2
      ];
      const expectedNewValues = callback(values.map(v => [v, v]));
      uut.combineAllDims(uut, callback);
      expect(uut.values).toEqual(expectedNewValues);
    });
  });
});
