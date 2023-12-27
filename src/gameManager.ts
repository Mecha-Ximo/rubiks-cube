import {
  Color3,
  Mesh,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { BASE_ROTATION } from './constants';
import { AuxiliarLayer } from './cube/auxiliarLayer';
import { RubiksCube } from './cube/rubiksCube';
import { Axis, Difficulty } from './types';
import { areNumbersClose } from './utils';

export class GameManager {
  private readonly onPickMaterial = new StandardMaterial(
    'selected',
    this.scene
  );

  private selectedCubie: Mesh | null = null;

  private readonly rubiksCube: RubiksCube;

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
    this.startGame(Difficulty.EASY);
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

    switch (e.code) {
      case 'ArrowUp': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        await this.auxLayerX.spinCubes(layerCubies, -BASE_ROTATION, speed);
        break;
      }
      case 'ArrowDown': {
        const layerCubies = this.extractLayerCubies('x', this.selectedCubie);
        await this.auxLayerX.spinCubes(layerCubies, BASE_ROTATION, speed);
        break;
      }
      case 'ArrowLeft': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        await this.auxLayerY.spinCubes(layerCubies, BASE_ROTATION, speed);
        break;
      }
      case 'ArrowRight': {
        const layerCubies = this.extractLayerCubies('y', this.selectedCubie);
        await this.auxLayerY.spinCubes(layerCubies, -BASE_ROTATION, speed);
        break;
      }
      case 'KeyQ': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        await this.auxLayerZ.spinCubes(layerCubies, BASE_ROTATION, speed);
        break;
      }
      case 'KeyW': {
        const layerCubies = this.extractLayerCubies('z', this.selectedCubie);
        await this.auxLayerZ.spinCubes(layerCubies, -BASE_ROTATION, speed);
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

  private async startGame(difficulty: Difficulty): Promise<void> {
    const speed = 2.5;

    const moves =
      difficulty === Difficulty.EASY
        ? 25
        : difficulty === Difficulty.MEDIUM
        ? 50
        : 100;

    const cubies = this.rubiksCube.cubies;
    const axes: [Axis, Axis, Axis] = ['x', 'y', 'z'];
    const rotations: number[] = [
      BASE_ROTATION,
      BASE_ROTATION * 2,
      BASE_ROTATION * 3,
    ];

    for (let i = 0; i < moves; i++) {
      const cubieIndex = Math.floor(Math.random() * cubies.length);
      const axisIndex = Math.floor(Math.random() * axes.length);
      const rotationIndex = Math.floor(Math.random() * rotations.length);

      const layerCubies = this.extractLayerCubies(
        axes[axisIndex],
        cubies[cubieIndex]
      );

      if (axes[axisIndex] === 'x') {
        await this.auxLayerX.spinCubes(
          layerCubies,
          rotations[rotationIndex],
          speed
        );
        continue;
      }

      if (axes[axisIndex] === 'y') {
        await this.auxLayerY.spinCubes(
          layerCubies,
          rotations[rotationIndex],
          speed
        );
        continue;
      }

      if (axes[axisIndex] === 'z') {
        await this.auxLayerZ.spinCubes(
          layerCubies,
          rotations[rotationIndex],
          speed
        );
        continue;
      }
    }
  }
}
