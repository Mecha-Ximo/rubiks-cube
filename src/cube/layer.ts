import { Mesh, Scene, TransformNode, Vector3 } from '@babylonjs/core';

export type LayerProps = {
  rubik: TransformNode;
  name: string;
  scene: Scene;
  position: Vector3;
};

/**
 * Transform node to spin a set of cubes all together.
 */
export class Layer extends TransformNode {
  constructor(props: LayerProps) {
    super(props.name, props.scene);
    this.position = props.position;
    this.parent = props.rubik;
  }

  /**
   * Add cubes
   * @param cubes
   */
  public addCubes(cubes: Mesh[]): void {
    for (const cube of cubes) {
      cube.parent = this;
    }

    this.positionLayer();
  }

  public removeCubes(): void {
    if (!this._children) {
      return;
    }

    for (const child of this._children) {
      child.parent = this.parent;
    }
  }

  private positionLayer(): void {
    if (!this._children) {
      throw new Error('No children are set');
    }

    const childrenMeshes = this._children.filter(
      (c): c is Mesh => c instanceof Mesh
    );
    const meshesPositions = childrenMeshes.map((m) => m.position);

    const center = new Vector3();
    for (const coordinate of ['x', 'y', 'z'] as const) {
      const positions = meshesPositions.map((m) => m[coordinate]);
      const min = Math.min(...positions);
      const max = Math.max(...positions);
      const centerPos = (min + max) / 2;

      center[coordinate] = centerPos;
    }

    this.position = center;
  }
}
