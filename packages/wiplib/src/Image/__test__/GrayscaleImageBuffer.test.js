import GrayscaleImageBuffer from "../GrayscaleImageBuffer";
import Pixel from "../Pixel";

describe("GrayscaleImageBuffer", () => {
  function rawRgbToGrayscale([r, g, b]) {
    return Math.round(r * 0.222 + g * 0.707 + b * 0.071);
  }

  describe("Blank Constructor", () => {
    let width;
    let height;
    let uut;

    beforeEach(() => {
      width = 2;
      height = 1;
      uut = GrayscaleImageBuffer.ofSize(width, height);
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
      uut = GrayscaleImageBuffer.from(width, height, rawRgbaPixels);
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
          const rgbaValue = rgbaPixels[j * 2 + i];
          const expectedGreyValue = rawRgbToGrayscale(rgbaValue);
          const expectedTransparency = rgbaValue[rgbaValue.length - 1];
          expect(pixel.values).toEqual([expectedGreyValue]);
          expect(pixel.transparency).toEqual(expectedTransparency);
        }
      }
    });
  });

  describe("Copy constructor", () => {
    let width;
    let height;
    let rgbaPixels;
    let srcBuffer;
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
      srcBuffer = GrayscaleImageBuffer.from(width, height, rawRgbaPixels);
      uut = GrayscaleImageBuffer.copyFrom(srcBuffer);
    });

    test("Should have same width", () => {
      expect(uut.width).toEqual(srcBuffer.width);
    });

    test("Should have same height", () => {
      expect(uut.height).toEqual(srcBuffer.height);
    });

    test("Should have all same pixel values", () => {
      for (let i = 0; i < uut.width; ++i) {
        for (let j = 0; j < uut.height; ++j) {
          const pixel = uut.getPixel(i, j);
          const originalPixel = srcBuffer.getPixel(i, j);
          expect(pixel.values).toEqual(originalPixel.values);
          expect(pixel.transparency).toEqual(originalPixel.transparency);
        }
      }
    });

    test("Should not be affected by original buffer setting a pixel", () => {
      const newFirstPixel = new Pixel([8, 9, 10], 0.5);
      srcBuffer.setPixel(0, 0, newFirstPixel);
      const firstPixelOfClone = uut.getPixel(0, 0);
      expect(firstPixelOfClone.values).not.toEqual(newFirstPixel.values);
      expect(firstPixelOfClone.values).toEqual([
        rawRgbToGrayscale(rgbaPixels[0].slice(0, -1))
      ]);
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
      uut = GrayscaleImageBuffer.from(width, height, rawRgbaPixels);
    });

    test("`forEachPixel` should iterate over all pixels", () => {
      const callback = (pixel, row, col) => {
        const arrayPos = col * 2 + row;
        const expectedRawRgbaValue = rgbaPixels[arrayPos];
        const expectedGreyValue = rawRgbToGrayscale(rgbaPixels[arrayPos]);
        const expectedTransparency =
          expectedRawRgbaValue[expectedRawRgbaValue.length - 1];
        expect(pixel.values).toEqual([expectedGreyValue]);
        expect(pixel.transparency).toEqual(expectedTransparency);
      };

      uut.forEachPixel(callback);
    });
  });

  describe("ImageData", () => {
    beforeEach(() => {
      global.ImageData = function(array, width, height) {
        this.data = array;
        this.width = width;
        this.height = height;
      };
    });

    afterEach(() => {
      global.ImageData = undefined;
    });

    describe("Right after construction", () => {
      let width;
      let height;
      let rgbaPixels;
      let rawRgbaPixels;
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
        rawRgbaPixels = new Uint8ClampedArray(rgbaPixels.flatMap(a => a));
        const imageBuffer = GrayscaleImageBuffer.from(
          width,
          height,
          rawRgbaPixels
        );
        uut = imageBuffer.toImageData();
      });

      test("Should have the same width", () => {
        expect(uut.width).toEqual(width);
      });

      test("Should have the same pixel values", () => {
        expect(uut.height).toEqual(height);
      });

      test("Should have the same pixel values", () => {
        const expectedRawRgbaValues = rgbaPixels.flatMap(
          ([r, g, b, transparency]) => {
            const gray = rawRgbToGrayscale([r, g, b]);
            return [gray, gray, gray, transparency];
          }
        );
        const expectedData = new Uint8ClampedArray(expectedRawRgbaValues);
        expect(uut.data).toEqual(expectedData);
      });
    });

    describe("After modifying pixels (inverse the pixel values)", () => {
      let width;
      let height;
      let rgbaPixels;
      let rawRgbaPixels;
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
        rawRgbaPixels = new Uint8ClampedArray(rgbaPixels.flatMap(a => a));
        const imageBuffer = GrayscaleImageBuffer.from(
          width,
          height,
          rawRgbaPixels
        );
        imageBuffer.forEachPixel(pixel => pixel.eachDim(value => 255 - value));
        uut = imageBuffer.toImageData();
      });

      test("Should have the same width", () => {
        expect(uut.width).toEqual(width);
      });

      test("Should have the same pixel values", () => {
        expect(uut.height).toEqual(height);
      });

      test("Should have the inverse of the original pixel values", () => {
        const expectedRawRgbaPixels = rgbaPixels.flatMap(
          ([r, g, b, transparency]) => {
            const gray = rawRgbToGrayscale([r, g, b]);
            const inverse = 255 - gray;
            return [inverse, inverse, inverse, transparency];
          }
        );
        const expectedData = new Uint8ClampedArray(expectedRawRgbaPixels);
        expect(uut.data).toEqual(expectedData);
      });
    });
  });
});
