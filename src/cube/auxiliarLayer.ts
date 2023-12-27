import {
  Animation,
  IAnimationKey,
  Mesh,
  Node,
  Nullable,
  Scene,
  TransformNode,
} from '@babylonjs/core';
import { Axis } from '../types';
import { getMeshesCenter } from '../utils';

export type LayerProps = {
  rotationAxis: Axis;
  rubik: TransformNode;
  name: string;
  scene: Scene;
};

/**
 * Transform node to spin a set of cubes all together.
 */
export class AuxiliarLayer extends TransformNode {
  private readonly scene: Scene;

  private readonly rotationAxis: Axis;

  private readonly frameRate = 60;

  private spinAnimationRunning = false;

  constructor(props: LayerProps) {
    super(props.name, props.scene);
    this.parent = props.rubik;
    this.scene = props.scene;
    this.rotationAxis = props.rotationAxis;
  }

  public spinCubes(
    layerCubies: Mesh[],
    rotationToAdd: number,
    speed = 1
  ): Promise<void> {
    if (this.spinAnimationRunning) {
      return Promise.resolve();
    }
    this.spinAnimationRunning = true;
    this.position = getMeshesCenter(layerCubies);
    this.updateCubiesParent(layerCubies, this);

    const animation = this.createAnimation(
      this.rotation[this.rotationAxis],
      rotationToAdd,
      speed
    );
    this.animations.push(animation);

    return new Promise((resolve) => {
      this.scene.beginAnimation(
        this,
        0,
        this.frameRate / speed,
        false,
        undefined,
        () => {
          this.updateCubiesParent(layerCubies, this.parent);
          this.spinAnimationRunning = false;
          resolve();
        }
      );
    });
  }

  private updateCubiesParent(cubies: Mesh[], newParent: Nullable<Node>): void {
    for (const cube of cubies) {
      cube.setParent(newParent);
    }
  }

  private createAnimation(
    currentValue: number,
    rotationToApply: number,
    speed = 1
  ) {
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
      frame: this.frameRate / speed,
      value: currentValue + rotationToApply,
    });

    rotationAnimation.setKeys(keys);

    return rotationAnimation;
  }
}
