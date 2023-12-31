import { Mesh, Vector3 } from '@babylonjs/core';

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

export function getMeshesCenter(meshes: Mesh[]): Vector3 {
  const meshesPositions = meshes.map((m) => m.position);

  const center = new Vector3();
  for (const coordinate of ['x', 'y', 'z'] as const) {
    const positions = meshesPositions.map((m) => m[coordinate]);
    const min = Math.min(...positions);
    const max = Math.max(...positions);
    const centerPos = (min + max) / 2;

    center[coordinate] = centerPos;
  }

  return center;
}

export function pad(value: number): string | number {
  return value < 10 ? '0' + value : value;
}
