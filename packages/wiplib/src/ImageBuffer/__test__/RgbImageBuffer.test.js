import RgbImageBuffer from "../RgbImageBuffer";

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
});
