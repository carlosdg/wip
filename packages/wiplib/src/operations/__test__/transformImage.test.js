import { createLookupTable, applyLookupTable } from "../transformImage";
import RgbaImageBuffer from "../../RgbaImageBuffer";

describe("transformImage", () => {
  describe("createLookupTable", () => {
    const identityCallback = () => value => value;

    test("Should iterate over all posible values", () => {
      const lookupTable = createLookupTable(identityCallback);
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
      inputImageBuffer = new RgbaImageBuffer(width, height, rawPixels);
    });

    test("Should return a new ImageBuffer", () => {
      const identityPixelOperation = () => value => value;
      const lookupTable = createLookupTable(identityPixelOperation);
      const resultImageBuffer = applyLookupTable(inputImageBuffer, lookupTable);
      const newFirstPixel = [0, 0, 0, 0];

      resultImageBuffer.pixels[0] = 0;
      resultImageBuffer.pixels[1] = 1;
      resultImageBuffer.pixels[2] = 2;
      resultImageBuffer.pixels[3] = 3;
      expect(inputImageBuffer.getPixel({ x: 0, y: 0 })).not.toEqual(
        newFirstPixel
      );
      expect(inputImageBuffer.getPixel({ x: 0, y: 0 })).toEqual(pixels[0]);
    });

    test("Should return an ImageBuffer with the mapped pixels", () => {
      const inversePixelOperation = () => value => 255 - value;
      const lookupTable = createLookupTable(inversePixelOperation);
      const resultImageBuffer = applyLookupTable(inputImageBuffer, lookupTable);
      const expectedPixelValues = pixels.flatMap(([r, g, b, a]) => [
        255 - r,
        255 - g,
        255 - b,
        a
      ]);

      expect(resultImageBuffer.pixels).toEqual(
        new Uint8ClampedArray(expectedPixelValues)
      );
    });
  });
});
