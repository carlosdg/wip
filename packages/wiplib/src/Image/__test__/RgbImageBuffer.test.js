import RgbImageBuffer from "../RgbImageBuffer";
import Pixel from "../Pixel";

describe("RgbImageBuffer", () => {
  describe("Blank Constructor", () => {
    let width;
    let height;
    let uut;

    beforeEach(() => {
      width = 2;
      height = 1;
      uut = RgbImageBuffer.ofSize(width, height);
    });

    test("Should have requested width", () => {
      expect(uut.width).toEqual(width);
    });

    test("Should have requested height", () => {
      expect(uut.height).toEqual(height);
    });

    test("Should have all pixels transparent", () => {
      for (let i = 0; i < uut.width; ++i) {
        for (let j = 0; j < uut.height; ++j) {
          const pixel = uut.getPixel(i, j);
          expect(pixel.transparency).toEqual(0);
        }
      }
    });
  });

  describe("Raw RGBA constructor", () => {
    let width;
    let height;
    let rgbaPixels;
    let uut;

    beforeEach(() => {
      width = 2;
      height = 2;
      rgbaPixels = [
        [0, 0, 0, 1],
        [255, 255, 255, 1],
        [100, 100, 100, 0],
        [123, 5, 200, 1]
      ];
      const rawRgbaPixels = new Uint8ClampedArray(rgbaPixels.flatMap(a => a));
      uut = RgbImageBuffer.from(width, height, rawRgbaPixels);
    });

    test("Should have requested width", () => {
      expect(uut.width).toEqual(width);
    });

    test("Should have requested height", () => {
      expect(uut.height).toEqual(height);
    });

    test("Should have all requested Pixel objects with the requested values", () => {
      for (let i = 0; i < uut.width; ++i) {
        for (let j = 0; j < uut.height; ++j) {
          const pixel = uut.getPixel(i, j);
          const expectedValue = rgbaPixels[j * 2 + i];
          expect(pixel.values).toEqual(expectedValue.slice(0, -1));
          expect(pixel.transparency).toEqual(...expectedValue.slice(-1));
        }
      }
    });
  });

  describe("Copy constructor", () => {
    let width;
    let height;
    let rgbaPixels;
    let originalBuffer;
    let uut;

    beforeEach(() => {
      width = 2;
      height = 2;
      rgbaPixels = [
        [0, 0, 0, 1],
        [255, 255, 255, 1],
        [100, 100, 100, 0],
        [123, 5, 200, 1]
      ];
      const rawRgbaPixels = new Uint8ClampedArray(rgbaPixels.flatMap(a => a));
      originalBuffer = RgbImageBuffer.from(width, height, rawRgbaPixels);
      uut = RgbImageBuffer.copyFrom(originalBuffer);
    });

    test("Should have same width", () => {
      expect(uut.width).toEqual(originalBuffer.width);
    });

    test("Should have same height", () => {
      expect(uut.height).toEqual(originalBuffer.height);
    });

    test("Should have all same pixel values", () => {
      for (let i = 0; i < uut.width; ++i) {
        for (let j = 0; j < uut.height; ++j) {
          const pixel = uut.getPixel(i, j);
          const originalPixel = originalBuffer.getPixel(i, j);
          expect(pixel.values).toEqual(originalPixel.values);
          expect(pixel.transparency).toEqual(originalPixel.transparency);
        }
      }
    });

    test("Should not be affected by original buffer setting a pixel", () => {
      const newOriginalFirstPixel = new Pixel([8, 9, 10], 0.5);
      originalBuffer.setPixel(0, 0, newOriginalFirstPixel);
      const cloneFirstPixel = uut.getPixel(0, 0);
      expect(cloneFirstPixel.values).not.toEqual(newOriginalFirstPixel.values);
      expect(cloneFirstPixel.values).toEqual(rgbaPixels[0].slice(0, -1));
    });
  });

  describe("Iteration", () => {
    let width;
    let height;
    let rgbaPixels;
    let uut;

    beforeEach(() => {
      width = 2;
      height = 2;
      rgbaPixels = [
        [0, 0, 0, 1],
        [255, 255, 255, 1],
        [100, 100, 100, 0],
        [123, 5, 200, 1]
      ];
      const rawRgbaPixels = new Uint8ClampedArray(rgbaPixels.flatMap(a => a));
      uut = RgbImageBuffer.from(width, height, rawRgbaPixels);
    });

    test("`forEachPixel` should iterate over all pixels", () => {
      const callback = (pixel, row, col) => {
        const arrayPos = col * 2 + row;
        const expectedPixelRgbaValue = rgbaPixels[arrayPos];
        expect(pixel.values).toEqual(expectedPixelRgbaValue.slice(0, -1));
        expect(pixel.transparency).toEqual(...expectedPixelRgbaValue.slice(-1));
      };

      uut.forEachPixel(callback);
    });
  });
});
