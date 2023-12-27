import {
  AxesViewer,
  Mesh,
  Scene,
  ShadowGenerator,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { getMeshesCenter } from '../utils';
import { Cubie } from './cubie';

type RubiksCubeProps = {
  name: string;
  scene: Scene;
  size: number;
  shadowGenerator: ShadowGenerator;
  position: Vector3;
};

export class RubiksCube extends TransformNode {
  private cubeCenter: Vector3;

  constructor(props: RubiksCubeProps) {
    super(props.name, props.scene);

    this.position = props.position;

    const cubiesMeshes = this.createCubies(
      props.size,
      props.scene,
      props.shadowGenerator
    );

    this.cubeCenter = getMeshesCenter(cubiesMeshes);

    this.createCoordinateSystem(props.scene);
  }

  public get center(): Vector3 {
    return this.cubeCenter;
  }

  private createCubies(
    size: number,
    scene: Scene,
    shadowGenerator: ShadowGenerator
  ): Mesh[] {
    const meshes: Mesh[] = [];

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        for (let k = 0; k < size; k += 1) {
          const cube = new Cubie(
            `box[${i}-${j}-${k}]`,
            scene,
            shadowGenerator,
            {
              x: i,
              y: j,
              z: k,
            }
          );

          meshes.push(cube.mesh);
          cube.parent = this;
        }
      }
    }

    return meshes;
  }

  // TODO: move to selector class (only appears when cubie selected)
  private createCoordinateSystem(scene: Scene): AxesViewer {
    const axes = new AxesViewer(scene, 2.5);
    axes.xAxis.setParent(this);
    axes.yAxis.setParent(this);
    axes.zAxis.setParent(this);
    axes.xAxis.position = this.center;
    axes.yAxis.position = this.center;
    axes.zAxis.position = this.center;

    return axes;
  }
}
