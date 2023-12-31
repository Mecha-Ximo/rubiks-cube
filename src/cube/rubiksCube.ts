import {
  Color3,
  Mesh,
  MultiMaterial,
  Scene,
  ShadowGenerator,
  StandardMaterial,
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

  private readonly cubieMaterial: MultiMaterial;

  private readonly scene: Scene;

  private readonly shadowGenerator: ShadowGenerator;

  constructor(props: RubiksCubeProps) {
    super(props.name, props.scene);

    this.cubieMaterial = this.createMultiMaterial(props.scene);
    this.position = props.position;
    this.scene = props.scene;
    this.shadowGenerator = props.shadowGenerator;

    const cubiesMeshes = this.createCubies(
      props.size,
      props.scene,
      props.shadowGenerator
    );

    this.cubeCenter = getMeshesCenter(cubiesMeshes);
  }

  public get center(): Vector3 {
    return this.cubeCenter;
  }

  public get cubies(): Mesh[] {
    return this.getChildMeshes<Mesh>().filter(({ id }) => id.startsWith('box'));
  }

  public rebuild(size: number): void {
    for (const cubie of this.cubies) {
      cubie.dispose();
    }

    this.createCubies(size, this.scene, this.shadowGenerator);
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
            },
            this.cubieMaterial
          );

          meshes.push(cube.mesh);
          cube.parent = this;
        }
      }
    }

    return meshes;
  }

  private createMultiMaterial(scene: Scene): MultiMaterial {
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
      const material = new StandardMaterial(`face-${index}`, scene);
      material.diffuseColor = color;
      materials.push(material);
    }

    const multiMaterial = new MultiMaterial('multi-material', scene);
    multiMaterial.subMaterials = materials;

    return multiMaterial;
  }
}
