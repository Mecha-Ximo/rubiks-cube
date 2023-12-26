/**
 * Indicates if 2 numbers are close or not.
 * @param num1 - the first number to compare
 * @param num2 - the second number to compare
 * @param tolerance - the max distance to determine if the numbers are close or not
 *
 * @returns true if the numbers distance is smaller than then tolerance
 */
export function areNumbersClose(
  num1: number,
  num2: number,
  tolerance: number
): boolean {
  return Math.abs(num1 - num2) <= tolerance;
}
