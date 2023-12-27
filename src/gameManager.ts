import {
  Color3,
  Mesh,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { AuxiliarLayer } from './cube/auxiliarLayer';
import { RubiksCube } from './cube/rubiksCube';
import { Axis } from './types';
import { areNumbersClose } from './utils';

export class GameManager {
  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  private selectedCubie: Mesh | null = null;

  private readonly rubiksCube: TransformNode;

  private readonly auxLayerX: AuxiliarLayer;
  private readonly auxLayerY: AuxiliarLayer;
  private readonly auxLayerZ: AuxiliarLayer;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: Scene,
    shadowGenerator: ShadowGenerator
  ) {
    this.rubiksCube = new RubiksCube({
      name: 'rubiks-cube',
      position: new Vector3(-1, 2, 0),
      scene,
      shadowGenerator,
      size: 4,
    });

    this.auxLayerX = new AuxiliarLayer({
      rotationAxis: 'x',
      name: 'aux-layerX',
      rubik: this.rubiksCube,
      scene,
    });
    this.auxLayerY = new AuxiliarLayer({
      rotationAxis: 'y',
      name: 'aux-layerY',
      rubik: this.rubiksCube,
      scene,
    });
    this.auxLayerZ = new AuxiliarLayer({
      rotationAxis: 'z',
      name: 'aux-layerZ',
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
    if (
      !pickedMesh ||
      !(pickedMesh instanceof Mesh) ||
      !pickedMesh.name.startsWith('box[')
    ) {
      return;
    }

    this.selectedCubie = pickedMesh;
  }

  private onKeyPress(e: KeyboardEvent) {
    if (!this.selectedCubie) {
      return;
    }

    switch (e.code) {
      case 'ArrowUp': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        this.auxLayerX.spinCubes(layerCubies, -Math.PI / 2);
        break;
      }
      case 'ArrowDown': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        this.auxLayerX.spinCubes(layerCubies, Math.PI / 2);
        break;
      }
      case 'ArrowLeft': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        this.auxLayerY.spinCubes(layerCubies, Math.PI / 2);
        break;
      }
      case 'ArrowRight': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        this.auxLayerY.spinCubes(layerCubies, -Math.PI / 2);
        break;
      }
      case 'KeyQ': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        this.auxLayerZ.spinCubes(layerCubies, Math.PI / 2);
        break;
      }
      case 'KeyW': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        this.auxLayerZ.spinCubes(layerCubies, -Math.PI / 2);
        break;
      }
    }

    this.selectedCubie = null;
  }

  private extractLayerCubies(axis: Axis, selectedCubie: Mesh): Mesh[] {
    const cubies = this.rubiksCube.getChildren(
      (n): n is Mesh => n instanceof Mesh
    );
    const layerCubies = cubies.filter((c) =>
      areNumbersClose(c.position[axis], selectedCubie.position[axis], 0.2)
    );

    return layerCubies;
  }

  private setupGame() {
    this.onPickMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    this.canvas.addEventListener('click', () => this.onCanvasClick());
    window.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
}
