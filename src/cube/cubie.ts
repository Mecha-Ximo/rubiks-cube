import {
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
import { Position } from '../types';

export class Cubie {
  // TODO make private
  public mesh: Mesh;

  private readonly scene: Scene;

  constructor(
    name: string,
    scene: Scene,
    shadowGenerator: ShadowGenerator,
    position: Position
  ) {
    this.scene = scene;
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
      new Color3(0.8, 0.1, 0.1), // Red
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
