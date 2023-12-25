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

  private readonly auxLayerX: Layer;
  private readonly auxLayerY: Layer;
  private readonly auxLayerZ: Layer;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: Scene,
    shadowGenerator: ShadowGenerator
  ) {
    this.rubiksCube = createCube(scene, shadowGenerator);
    this.auxLayerX = new Layer({
      name: 'aux-layerX',
      rubik: this.rubiksCube,
      scene,
    });
    this.auxLayerY = new Layer({
      name: 'aux-layer',
      rubik: this.rubiksCube,
      scene,
    });
    this.auxLayerZ = new Layer({
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
    if (!this.selectedCubie) {
      return;
    }

    switch (e.code) {
      case 'ArrowLeft': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.x, this.selectedCubie!.position.x)
        );

        this.auxLayerX.spinCubes(layerCubies, 'x', Math.PI / 2);
        break;
      }
      case 'ArrowRight': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.x, this.selectedCubie!.position.x)
        );

        this.auxLayerX.spinCubes(layerCubies, 'x', -Math.PI / 2);
        break;
      }
      case 'ArrowUp': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.y, this.selectedCubie!.position.y)
        );

        this.auxLayerY.spinCubes(layerCubies, 'y', Math.PI / 2);
        break;
      }
      case 'ArrowDown': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.y, this.selectedCubie!.position.y)
        );

        this.auxLayerY.spinCubes(layerCubies, 'y', -Math.PI / 2);
        break;
      }
      case 'KeyQ': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.z, this.selectedCubie!.position.z)
        );

        this.auxLayerZ.spinCubes(layerCubies, 'z', -Math.PI / 2);
        break;
      }
      case 'KeyW': {
        const cubies = this.rubiksCube.getChildren(
          (n): n is Mesh => n instanceof Mesh
        );
        const layerCubies = cubies.filter((c) =>
          this.areNumbersClose(c.position.z, this.selectedCubie!.position.z)
        );

        this.auxLayerZ.spinCubes(layerCubies, 'z', Math.PI / 2);
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

  private areNumbersClose(num1: number, num2: number, tolerance = 0.2) {
    return Math.abs(num1 - num2) <= tolerance;
  }
}
