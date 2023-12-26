import {
  AxesViewer,
  Color3,
  Mesh,
  MeshBuilder,
  MultiMaterial,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  SubMesh,
  TransformNode,
} from '@babylonjs/core';
import { getMeshesCenter } from './utils';

type Position = {
  x: number;
  y: number;
  z: number;
};

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
        const cube = new BaseCube(`box-${i}${j}${k}`, scene, shadowGenerator, {
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

export class BaseCube {
  public mesh: Mesh;

  constructor(
    private readonly name: string,
    private readonly scene: Scene,
    private readonly shadowGenerator: ShadowGenerator,
    private position: Position
  ) {
    const materials = this.createFaceMaterials();
    const multiMaterial = new MultiMaterial('multi-material', scene);
    multiMaterial.subMaterials = materials;

    // box
    const box = MeshBuilder.CreateBox(name, { size: 0.9 }, scene);
    box.subMeshes = [];
    const verticesCount = box.getTotalVertices();
    for (let i = 0; i < 6; i++) {
      box.subMeshes.push(new SubMesh(i, 0, verticesCount, i * 6, 6, box));
    }
    box.material = multiMaterial;

    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;

    this.mesh = box;
    shadowGenerator.addShadowCaster(this.mesh);
    this.mesh.receiveShadows = true;
  }

  private createFaceMaterials() {
    const colors = [
      new Color3(1, 0, 0), // Red
      new Color3(0, 1, 0), // Green
      new Color3(0, 0, 1), // Blue
      new Color3(1, 1, 0), // Yellow
      new Color3(1, 0, 1), // Purple
      new Color3(0, 1, 1), // Cyan
    ];

    const materials: StandardMaterial[] = [];
    for (const [index, color] of colors.entries()) {
      const material = new StandardMaterial(`face-${index}`, this.scene);
      material.diffuseColor = color;
      materials.push(material);
    }

    return materials;
  }

  public set parent(p: TransformNode) {
    this.mesh.parent = p;
  }
}
