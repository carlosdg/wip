/**
 * Returns the given RGB pixel converted to HSL. RGB pixel values should be between
 * 0 and 255. The H channel of the converted pixel varies between 0 and 359, S and L
 * channels are between 0 and 1
 *
 * @param {Number} r Value of R channel
 * @param {Number} g Value of G channel
 * @param {Number} b Value of B channel
 * @returns {Object} HSL equivalent pixel
 */
export function RGBToHSL({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const l = (max + min) / 2;
  const s =
    l < Number.EPSILON || Math.abs(1 - l) < Number.EPSILON
      ? 0
      : chroma / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (chroma >= Number.EPSILON) {
    switch (max) {
      case r:
        h = ((g - b) / chroma) % 6;
        break;
      case g:
        h = (b - r) / chroma + 2;
        break;
      case b:
        h = (r - g) / chroma + 4;
        break;
    }
  }
  h *= 60;
  return { h, s, l };
}

/**
 * Returns the given HSL pixel converted to RGB. H channel value should be between
 * 0 and 359, S and L channels values should be between 0 and 1.RGB pixel values varies
 * between 0 and 255
 *
 * @param {Number} h Value of H channel
 * @param {Number} s Value of S channel
 * @param {Number} l Value of L channel
 * @returns {Object} RGB equivalent pixel
 */
export function HSLToRGB({ h, s, l }) {
  let values = [0, 0, 0];

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  if (h < 60) values = [c, x, 0];
  else if (h < 120) values = [x, c, 0];
  else if (h < 180) values = [0, c, x];
  else if (h < 240) values = [0, x, c];
  else if (h < 300) values = [x, 0, c];
  else if (h < 360) values = [c, 0, x];

  return {
    r: Math.round((values[0] + m) * 255),
    g: Math.round((values[1] + m) * 255),
    b: Math.round((values[2] + m) * 255)
  };
}