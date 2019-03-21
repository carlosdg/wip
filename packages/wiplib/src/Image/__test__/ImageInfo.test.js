import RgbImageBuffer from "../RgbImageBuffer";
import ImageInfo from "../ImageInfo";

describe("ImageInfo", () => {
  describe("For RgbImageBuffer with transparent pixels", () => {
    let width;
    let height;
    let rgbaPixels;
    let imageBuffer;
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
      imageBuffer = RgbImageBuffer.from(width, height, rawRgbaPixels);
      uut = new ImageInfo(imageBuffer);
    });

    test("Should have valid pixel count", () => {
      expect(uut.pixelCount).toEqual(width * height);
    });

    [
      { name: "Red", index: 0 },
      { name: "Blue", index: 1 },
      { name: "Green", index: 2 }
    ].forEach(({ name, index }) => {
      test(`Should have valid ${name} histogram `, () => {
        const expectedHistogram = new Array(256).fill(0);
        rgbaPixels
          .map(pixel => pixel[index])
          .forEach(colorValue => (expectedHistogram[colorValue] += 1));
        expect(uut.histograms[index]).toEqual(expectedHistogram);
      });
    });

    [
      { name: "Red", index: 0 },
      { name: "Blue", index: 1 },
      { name: "Green", index: 2 }
    ].forEach(({ name, index }) => {
      test(`Should have valid ${name} cumulative histogram`, () => {
        const colorValues = rgbaPixels.map(pixel => pixel[index]);
        let accumulatedCount = 0;
        const expectedHistogram = new Array(256)
          .fill(0)
          .map((count, currValue) => {
            if (colorValues.includes(currValue)) {
              accumulatedCount += 1;
            }
            return count + accumulatedCount;
          });
        expect(uut.cumulativeHistograms[index]).toEqual(expectedHistogram);
      });
    });

    [
      { name: "Red", index: 0 },
      { name: "Blue", index: 1 },
      { name: "Green", index: 2 }
    ].forEach(({ name, index }) => {
      test(`Should have valid ${name} brightness`, () => {
        const colorValueSum = rgbaPixels
          .map(pixel => pixel[index])
          .reduce((sum, currValue) => sum + currValue, 0);
        const colorValueMean = colorValueSum / (width * height);

        expect(uut.brightnesses[index]).toEqual(colorValueMean);
      });
    });

    [
      { name: "Red", index: 0 },
      { name: "Blue", index: 1 },
      { name: "Green", index: 2 }
    ].forEach(({ name, index }) => {
      test(`Should have valid ${name} contrast`, () => {
        const colorValues = rgbaPixels.map(pixel => pixel[index]);
        const sum = colorValues.reduce((sum, currValue) => sum + currValue, 0);
        const mean = sum / colorValues.length;
        const squaredErrorSum = colorValues.reduce(
          (sum, currValue) => sum + (currValue - mean) ** 2,
          0
        );
        const stdDev = Math.sqrt(squaredErrorSum / colorValues.length);

        expect(uut.contrasts[index]).toEqual(stdDev);
      });
    });
  });
});
