import {
  Animation,
  IAnimationKey,
  Mesh,
  Scene,
  TransformNode,
  Vector3,
} from '@babylonjs/core';

export type LayerProps = {
  rubik: TransformNode;
  name: string;
  scene: Scene;
};

/**
 * Transform node to spin a set of cubes all together.
 */
export class Layer {
  private readonly scene: Scene;

  public readonly node: TransformNode;

  private readonly frameRate = 60;

  private animationRunning = false;

  constructor(props: LayerProps) {
    this.node = new TransformNode(props.name, props.scene);
    this.node.parent = props.rubik;
    this.scene = props.scene;
  }

  /**
   * Add cubes
   * @param cubes
   */
  public spinCubes(
    cubes: Mesh[],
    axis: 'x' | 'y' | 'z',
    rotationToAdd: number
  ): void {
    if (this.animationRunning) {
      return;
    }

    this.animationRunning = true;
    this.positionLayer(cubes);

    for (const cube of cubes) {
      cube.setParent(this.node);
    }

    const animation = this.createAnimation(
      axis,
      this.node.rotation[axis],
      rotationToAdd
    );
    this.node.animations.push(animation);

    this.scene.beginAnimation(
      this.node,
      0,
      this.frameRate / 2,
      false,
      undefined,
      () => {
        for (const cube of cubes) {
          cube.setParent(this.node.parent);
        }
        this.animationRunning = false;
      }
    );
  }

  private positionLayer(cubies: Mesh[]): void {
    const meshesPositions = cubies.map((m) => m.position);

    const center = new Vector3();
    for (const coordinate of ['x', 'y', 'z'] as const) {
      const positions = meshesPositions.map((m) => m[coordinate]);
      const min = Math.min(...positions);
      const max = Math.max(...positions);
      const centerPos = (min + max) / 2;

      center[coordinate] = centerPos;
    }
    console.log('center', center);
    this.node.position = center;
  }

  private createAnimation(
    axis: 'x' | 'y' | 'z',
    currentValue: number,
    rotationToApply: number
  ) {
    const rotationAnimation = new Animation(
      'rotateAnimation',
      `rotation.${axis}`,
      this.frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keys: IAnimationKey[] = [];

    keys.push({ frame: 0, value: currentValue });
    keys.push({
      frame: this.frameRate / 2,
      value: currentValue + rotationToApply,
    });

    rotationAnimation.setKeys(keys);

    return rotationAnimation;
  }
}
