import {
  Color3,
  Material,
  Mesh,
  Nullable,
  Scene,
  StandardMaterial,
} from '@babylonjs/core';
import { BASE_ROTATION } from '../constants';
import { RubiksCube } from '../cube/rubiksCube';
import { Axis } from '../types';
import { AuxiliarLayers } from '../types/layer';
import { CoordinateSystemHelper } from './coordinateSystemHelper';

export class SelectionManager {
  private selectedCubie: Mesh | null = null;

  private baseCubieMaterial: Nullable<Material> = null;

  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  private readonly coordinateSystemHelper: CoordinateSystemHelper;

  constructor(
    private readonly auxiliarLayers: AuxiliarLayers,
    private readonly scene: Scene,
    private readonly canvas: HTMLCanvasElement,
    rubiksCube: RubiksCube
  ) {
    this.coordinateSystemHelper = new CoordinateSystemHelper(
      rubiksCube,
      scene,
      3
    );
    this.coordinateSystemHelper.setVisible(false);
    this.setupSelection();
  }

  public get isSelectionMode(): boolean {
    return !!this.selectCubie;
  }

  private onCanvasClick() {
    if (this.selectedCubie) {
      this.unselectCubie(this.selectedCubie);
    }

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

    this.selectCubie(pickedMesh);
  }

  private selectCubie(cubie: Mesh): void {
    this.selectedCubie = cubie;
    this.baseCubieMaterial = cubie.material;
    cubie.material = this.onPickMaterial;
    this.coordinateSystemHelper.setVisible(true);
  }

  private unselectCubie(cubie: Mesh): void {
    cubie.material = this.baseCubieMaterial;
    this.selectedCubie = null;
    this.coordinateSystemHelper.setVisible(false);
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

    this.unselectCubie(this.selectedCubie);
  }

  private setupSelection() {
    this.onPickMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3);
    this.canvas.addEventListener('click', () => this.onCanvasClick());
    window.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
}
