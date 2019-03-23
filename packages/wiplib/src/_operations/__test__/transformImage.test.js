import { createLookupTable, applyLookupTable } from "../transformImage";
import RgbImageBuffer from "../../Image/RgbImageBuffer";
import Pixel from "../../Image/Pixel";

describe("transformImage", () => {
  describe("createLookupTable", () => {
    const identityCallback = value => value;
    const lookupTableInvalidSizes = [
      ["1x3", [1], [2, 3, 4]],
      ["3x1", [1, 2, 3], [4]],
      ["1x0", [1], []],
      ["0x1", [], [1]]
    ];
    const lookupTableValidSizes = [
      [0, [], []],
      [1, [1], [1]],
      [2, [1, 2], [3, 4]],
      [3, [1, 2, 3], [4, 5, 6]]
    ];

    lookupTableInvalidSizes.forEach(([sizeName, minValues, maxValues]) => {
      test(`Should throw error with sizes of different dimensions: ${sizeName}`, () => {
        expect(() => {
          createLookupTable(minValues, maxValues, identityCallback);
        }).toThrow();
      });
    });

    lookupTableValidSizes.forEach(
      ([expectedDimension, minValues, maxValues]) => {
        test(`Should return a lookup table of valid dimension: ${expectedDimension}`, () => {
          const lookupTable = createLookupTable(
            minValues,
            maxValues,
            identityCallback
          );
          expect(lookupTable.length).toEqual(expectedDimension);
        });
      }
    );

    test("Should iterate over all posible values", () => {
      const lookupTable = createLookupTable([0], [255], identityCallback);
      const expectedTable = Array(256)
        .fill(0)
        .map((_, index) => index);
      expect(lookupTable[0]).toEqual(expectedTable);
    });
  });

  describe("applyLookupTable", () => {
    const width = 2;
    const height = 2;
    let pixels;
    let rawPixels;
    let inputImageBuffer;

    beforeEach(() => {
      pixels = [
        [23, 1, 233, 1],
        [12, 3, 6, 0],
        [255, 255, 255, 1],
        [0, 0, 0, 1]
      ];
      rawPixels = new Uint8ClampedArray(pixels.flatMap(pixel => pixel));
      inputImageBuffer = RgbImageBuffer.from(width, height, rawPixels);
    });

    test("Should return a new ImageBuffer", () => {
      const identityPixelOperation = value => value;
      const lookupTable = createLookupTable(
        inputImageBuffer.minPixelValues,
        inputImageBuffer.maxPixelValues,
        identityPixelOperation
      );
      const resultImageBuffer = applyLookupTable(inputImageBuffer, lookupTable);
      const newFirstPixel = new Pixel([0, 0, 0], 0);

      resultImageBuffer.setPixel(0, 0, newFirstPixel);
      expect(inputImageBuffer.getPixel(0, 0)).not.toEqual(newFirstPixel);
      expect(inputImageBuffer.getPixel(0, 0).values).toEqual(
        pixels[0].slice(0, -1)
      );
    });

    test("Should return an ImageBuffer with the mapped pixels", () => {
      const inversePixelOperation = value => 255 - value;
      const lookupTable = createLookupTable(
        inputImageBuffer.minPixelValues,
        inputImageBuffer.maxPixelValues,
        inversePixelOperation
      );
      const resultImageBuffer = applyLookupTable(inputImageBuffer, lookupTable);
      const expectedPixelValues = pixels.map(([r, g, b]) => [
        255 - r,
        255 - g,
        255 - b
      ]);

      resultImageBuffer.forEachPixel((pixel, i, j) => {
        expect(pixel.values).toEqual(expectedPixelValues[j * 2 + i]);
      });
    });
  });
});
