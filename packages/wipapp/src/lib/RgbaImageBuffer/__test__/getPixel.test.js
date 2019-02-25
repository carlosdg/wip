import RgbaImageBuffer from "..";

describe("RgbaImageBuffer__getPixel--2x2_Image", () => {
  const width = 2;
  const height = 2;
  let pixels = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
  let uut = new RgbaImageBuffer(width, height, new Uint8ClampedArray(pixels));

  test("Should return first pixel value with x = 0, y = 0", () => {
    const pos = { x: 0, y: 0 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(0, 4));
  });

  test("Should return first pixel value with x = -1, y = 0", () => {
    const pos = { x: -1, y: 0 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(0, 4));
  });

  test("Should return first pixel value with x = 0, y = -1", () => {
    const pos = { x: 0, y: -1 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(0, 4));
  });

  test("Should return first pixel value with x = -1, y = -1", () => {
    const pos = { x: -1, y: -1 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(0, 4));
  });

  test("Should return last pixel value with x = 1, y = 1", () => {
    const pos = { x: 1, y: 1 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(12, 16));
  });

  test("Should return last pixel value with x = 2, y = 2", () => {
    const pos = { x: 2, y: 2 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(12, 16));
  });

  test("Should return last pixel value with x = 2000, y = 2000", () => {
    const pos = { x: 2000, y: 2000 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(12, 16));
  });

  test("Should return second pixel value with x = 1, y = 0", () => {
    const pos = { x: 1, y: 0 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(4, 8));
  });

  test("Should return second pixel value with x = 2, y = 0", () => {
    const pos = { x: 2, y: 0 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(4, 8));
  });

  test("Should return third pixel value with x = 0, y = 1", () => {
    const pos = { x: 0, y: 1 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(8, 12));
  });

  test("Should return third pixel value with x = 0, y = 2", () => {
    const pos = { x: 0, y: 2 };
    expect(uut.getPixel(pos)).toEqual(pixels.slice(8, 12));
  });
});
