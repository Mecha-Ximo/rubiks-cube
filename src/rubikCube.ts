import {
  AxesViewer,
  Mesh,
  Scene,
  ShadowGenerator,
  TransformNode,
} from '@babylonjs/core';
import { Cubie } from './cube/cubie';
import { getMeshesCenter } from './utils';

export function createCube(
  scene: Scene,
  shadowGenerator: ShadowGenerator,
  size = 3
): TransformNode {
  const group = new TransformNode('rubik-cube', scene);
  group.position.x = -1;
  group.position.y = 3;

  const cubeMeshes: Mesh[] = [];

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      for (let k = 0; k < size; k += 1) {
        const cube = new Cubie(`box-${i}${j}${k}`, scene, shadowGenerator, {
          x: i,
          y: j,
          z: k,
        });
        cubeMeshes.push(cube.mesh);
        cube.parent = group;
      }
    }
  }

  const center = getMeshesCenter(cubeMeshes);
  const axes = new AxesViewer(scene, 2.5);
  axes.xAxis.setParent(group);
  axes.yAxis.setParent(group);
  axes.zAxis.setParent(group);
  axes.xAxis.position = center;
  axes.yAxis.position = center;
  axes.zAxis.position = center;

  return group;
}
