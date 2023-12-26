import {
  Animation,
  IAnimationKey,
  Mesh,
  Scene,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { Axis } from '../types';

export type LayerProps = {
  rotationAxis: Axis;
  rubik: TransformNode;
  name: string;
  scene: Scene;
};

/**
 * Transform node to spin a set of cubes all together.
 */
export class AuxiliarLayer {
  private readonly scene: Scene;

  private readonly rotationAxis: Axis;

  public readonly node: TransformNode;

  private readonly frameRate = 60;

  private spinAnimationRunning = false;

  constructor(props: LayerProps) {
    this.node = new TransformNode(props.name, props.scene);
    this.node.parent = props.rubik;
    this.scene = props.scene;
    this.rotationAxis = props.rotationAxis;
  }

  public spinCubes(layerCubies: Mesh[], rotationToAdd: number): void {
    if (this.spinAnimationRunning) {
      return;
    }

    this.spinAnimationRunning = true;
    this.positionLayer(layerCubies);

    for (const cube of layerCubies) {
      cube.setParent(this.node);
    }

    const animation = this.createAnimation(
      this.node.rotation[this.rotationAxis],
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
        for (const cube of layerCubies) {
          cube.setParent(this.node.parent);
        }
        this.spinAnimationRunning = false;
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

    this.node.position = center;
  }

  private createAnimation(currentValue: number, rotationToApply: number) {
    const rotationAnimation = new Animation(
      'rotateAnimation',
      `rotation.${this.rotationAxis}`,
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
