import { Color3, Mesh, Scene, StandardMaterial } from '@babylonjs/core';
import { BASE_ROTATION } from '../constants';
import { RubiksCube } from '../cube/rubiksCube';
import { Axis } from '../types';
import { AuxiliarLayers } from '../types/layer';
import { areNumbersClose } from '../utils';

export class SelectionManager {
  private selectedCubie: Mesh | null = null;

  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  constructor(
    private readonly auxiliarLayers: AuxiliarLayers,
    private readonly rubiksCube: RubiksCube,
    private readonly scene: Scene,
    private readonly canvas: HTMLCanvasElement
  ) {
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

  private extractLayerCubies(axis: Axis, selectedCubie: Mesh): Mesh[] {
    const cubies = this.rubiksCube.getChildren(
      (n): n is Mesh => n instanceof Mesh
    );
    const layerCubies = cubies.filter((c) =>
      areNumbersClose(c.position[axis], selectedCubie.position[axis], 0.2)
    );

    return layerCubies;
  }

  private async onKeyPress(e: KeyboardEvent) {
    if (!this.selectedCubie) {
      return;
    }

    const speed = 5;

    switch (e.code) {
      case 'ArrowUp': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        await this.auxiliarLayers['x'].spinCubes(
          layerCubies,
          -BASE_ROTATION,
          speed
        );
        break;
      }
      case 'ArrowDown': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        await this.auxiliarLayers['x'].spinCubes(
          layerCubies,
          BASE_ROTATION,
          speed
        );
        break;
      }
      case 'ArrowLeft': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        await this.auxiliarLayers['y'].spinCubes(
          layerCubies,
          BASE_ROTATION,
          speed
        );
        break;
      }
      case 'ArrowRight': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        await this.auxiliarLayers['y'].spinCubes(
          layerCubies,
          -BASE_ROTATION,
          speed
        );
        break;
      }
      case 'KeyQ': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        await this.auxiliarLayers['z'].spinCubes(
          layerCubies,
          BASE_ROTATION,
          speed
        );
        break;
      }
      case 'KeyW': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        await this.auxiliarLayers['z'].spinCubes(
          layerCubies,
          -BASE_ROTATION,
          speed
        );
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
