import {
  AbstractMesh,
  Color3,
  Mesh,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  TransformNode,
} from '@babylonjs/core';
import { Layer } from './cube/layer';
import { createCube } from './rubikCube';

export class GameManager {
  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  private selectedCubie: AbstractMesh | null = null;

  private readonly rubiksCube: TransformNode;

  private readonly auxLayer: Layer;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: Scene,
    private readonly shadowGenerator: ShadowGenerator
  ) {
    this.rubiksCube = createCube(scene, shadowGenerator);
    this.auxLayer = new Layer({
      name: 'aux-layer',
      rubik: this.rubiksCube,
      scene,
    });
    this.setupGame();
  }

  private onCanvasClick() {
    const pickResult = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );
    if (!pickResult) {
      return;
    }

    const pickedMesh = pickResult.pickedMesh;
    if (!pickedMesh || !pickedMesh.name.startsWith('box-')) {
      return;
    }

    this.selectedCubie = pickedMesh;
  }

  private onKeyPress(e: KeyboardEvent) {
    console.log(e.key);
    if (!this.selectedCubie) {
      return;
    }

    switch (e.code) {
      case 'ArrowLeft': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter(
          (c) => c.position.y === this.selectedCubie?.position.y
        );

        this.auxLayer.spinCubes(layerCubies, 'y', Math.PI / 2);
        break;
      }
      case 'ArrowRight': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter(
          (c) => c.position.y === this.selectedCubie?.position.y
        );

        this.auxLayer.spinCubes(layerCubies, 'y', -Math.PI / 2);
        break;
      }
      case 'ArrowUp': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter(
          (c) => c.position.z === this.selectedCubie?.position.z
        );

        this.auxLayer.spinCubes(layerCubies, 'z', Math.PI / 2);
        break;
      }
      case 'ArrowDown': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter(
          (c) => c.position.z === this.selectedCubie?.position.z
        );

        this.auxLayer.spinCubes(layerCubies, 'z', -Math.PI / 2);
        break;
      }
    }

    this.selectedCubie = null;
  }

  private setupGame() {
    this.onPickMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    this.canvas.addEventListener('click', () => this.onCanvasClick());
    window.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
}
