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
import { SelectionManagerUI } from './selectionManagerUI';

export class SelectionManager {
  private ui: SelectionManagerUI;

  private selectedCubie: Mesh | null = null;

  private baseCubieMaterial: Nullable<Material> = null;

  private isSelecting = false;

  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  private readonly coordinateSystemHelper: CoordinateSystemHelper;

  private readonly onSpin: null | (() => void);

  constructor(
    private readonly auxiliarLayers: AuxiliarLayers,
    private readonly scene: Scene,
    private readonly canvas: HTMLCanvasElement,
    rubiksCube: RubiksCube,
    onSpin?: () => void
  ) {
    this.coordinateSystemHelper = new CoordinateSystemHelper(
      rubiksCube,
      scene,
      1.5
    );
    this.coordinateSystemHelper.setVisible(false);
    this.setupSelection();
    this.ui = new SelectionManagerUI();
    this.onSpin = onSpin ?? null;
  }

  public get isSelectionMode(): boolean {
    return !!this.selectCubie;
  }

  private onCanvasClick(): void {
    if (!this.isSelecting) {
      return;
    }

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
    this.ui.showSpinCubieDiv();
  }

  private unselectCubie(cubie: Mesh): void {
    cubie.material = this.baseCubieMaterial;
    this.selectedCubie = null;
    this.coordinateSystemHelper.setVisible(false);
    this.ui.showSelectCubieDiv();
  }

  private async onKeyPress(e: KeyboardEvent) {
    if (!this.selectedCubie) {
      return;
    }

    const speed = 4;
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
        rotation = -BASE_ROTATION;
        axis = 'z';
        break;
      }
      case 'KeyW': {
        rotation = BASE_ROTATION;
        axis = 'z';
        break;
      }
    }

    this.onSpin?.();

    await this.auxiliarLayers[axis].spinCube(
      this.selectedCubie,
      rotation,
      speed
    );

    this.unselectCubie(this.selectedCubie);
  }

  private setupSelection() {
    this.onPickMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);

    this.canvas.addEventListener(
      'pointerdown',
      () => (this.isSelecting = true)
    );

    this.canvas.addEventListener(
      'pointermove',
      () => (this.isSelecting = false)
    );

    this.canvas.addEventListener('pointerup', () => this.onCanvasClick());

    window.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
}
