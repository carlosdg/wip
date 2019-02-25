/**
 * Returns whether the given value is in range [min, max).
 * That is min <= value < max;
 *
 * @param {number} value  Value to check if it is in range
 * @param {number} min  Range minimum (inclusive)
 * @param {number} max  Range maximum (exclusive)
 */
export const isInRange = (value, min, max) => value >= min && value < max;
