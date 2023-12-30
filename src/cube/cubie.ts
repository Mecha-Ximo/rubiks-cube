import {
  Mesh,
  MeshBuilder,
  MultiMaterial,
  Scene,
  ShadowGenerator,
  SubMesh,
  TransformNode,
} from '@babylonjs/core';
import { Position } from '../types';

export class Cubie {
  // TODO make private
  public mesh: Mesh;

  private readonly scene: Scene;

  constructor(
    name: string,
    scene: Scene,
    shadowGenerator: ShadowGenerator,
    position: Position,
    cubieFacesMaterial: MultiMaterial
  ) {
    this.scene = scene;

    const box = MeshBuilder.CreateBox(name, { size: 0.9 }, scene);
    box.subMeshes = [];
    const verticesCount = box.getTotalVertices();
    for (let i = 0; i < 6; i++) {
      box.subMeshes.push(new SubMesh(i, 0, verticesCount, i * 6, 6, box));
    }
    box.material = cubieFacesMaterial;

    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;

    this.mesh = box;
    shadowGenerator.addShadowCaster(this.mesh);
    this.mesh.receiveShadows = true;
  }

  public set parent(p: TransformNode) {
    this.mesh.parent = p;
  }
}
