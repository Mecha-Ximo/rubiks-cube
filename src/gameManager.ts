import { Mesh, Scene, ShadowGenerator, Vector3 } from '@babylonjs/core';
import { BASE_ROTATION } from './constants';
import { AuxiliarLayer } from './cube/auxiliarLayer';
import { RubiksCube } from './cube/rubiksCube';
import { SelectionManager } from './game/selectionManager';
import { Axis, Difficulty } from './types';
import { AuxiliarLayers } from './types/layer';
import { areNumbersClose } from './utils';

export class GameManager {
  private readonly rubiksCube: RubiksCube;

  private readonly auxiliarLayers: AuxiliarLayers;

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    shadowGenerator: ShadowGenerator
  ) {
    this.rubiksCube = new RubiksCube({
      name: 'rubiks-cube',
      position: new Vector3(-1, 2, 0),
      scene,
      shadowGenerator,
      size: 4,
    });

    this.auxiliarLayers = {
      x: new AuxiliarLayer({
        rotationAxis: 'x',
        name: 'aux-layerX',
        rubik: this.rubiksCube,
        scene,
      }),
      y: new AuxiliarLayer({
        rotationAxis: 'y',
        name: 'aux-layerY',
        rubik: this.rubiksCube,
        scene,
      }),
      z: new AuxiliarLayer({
        rotationAxis: 'z',
        name: 'aux-layerZ',
        rubik: this.rubiksCube,
        scene,
      }),
    };

    this.startGame(Difficulty.EASY);
    new SelectionManager(this.auxiliarLayers, this.rubiksCube, scene, canvas);
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

      await this.auxiliarLayers[axes[axisIndex]].spinCubes(
        layerCubies,
        rotations[rotationIndex],
        speed
      );
    }
  }
}
