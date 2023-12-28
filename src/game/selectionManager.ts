import { Color3, Mesh, Scene, StandardMaterial } from '@babylonjs/core';
import { BASE_ROTATION } from '../constants';
import { Axis } from '../types';
import { AuxiliarLayers } from '../types/layer';

export class SelectionManager {
  private selectedCubie: Mesh | null = null;

  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  constructor(
    private readonly auxiliarLayers: AuxiliarLayers,
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

  private async onKeyPress(e: KeyboardEvent) {
    if (!this.selectedCubie) {
      return;
    }

    const speed = 5;
    let rotation = 0;
    let axis: Axis = 'x';

    switch (e.code) {
      case 'ArrowUp': {
        rotation = -BASE_ROTATION;
        axis = 'x';
        break;
      }
      case 'ArrowDown': {
        rotation = BASE_ROTATION;
        axis = 'x';
        break;
      }
      case 'ArrowLeft': {
        rotation = BASE_ROTATION;
        axis = 'y';
        break;
      }
      case 'ArrowRight': {
        rotation = -BASE_ROTATION;
        axis = 'y';
        break;
      }
      case 'KeyQ': {
        rotation = BASE_ROTATION;
        axis = 'z';
        break;
      }
      case 'KeyW': {
        rotation = -BASE_ROTATION;
        axis = 'z';
        break;
      }
    }

    await this.auxiliarLayers[axis].spinCube(
      this.selectedCubie,
      rotation,
      speed
    );

    this.selectedCubie = null;
  }

  private setupGame() {
    this.onPickMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    this.canvas.addEventListener('click', () => this.onCanvasClick());
    window.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
}
