import { Scene, ShadowGenerator, Vector3 } from '@babylonjs/core';
import { BASE_ROTATION } from '../constants';
import { AuxiliarLayer } from '../cube/auxiliarLayer';
import { RubiksCube } from '../cube/rubiksCube';
import { Axis, Difficulty, GameState } from '../types';
import { AuxiliarLayers } from '../types/layer';
import { GameManagerUI } from './gameManagerUI';
import { SelectionManager } from './selectionManager';

export class GameManager {
  private readonly rubiksCube: RubiksCube;

  private readonly selectionManger: SelectionManager;

  private readonly auxiliarLayers: AuxiliarLayers;

  private readonly ui: GameManagerUI;

  private difficulty = Difficulty.EASY;

  private size = 4;

  private spins = 0;

  private seconds = 0;

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
      size: this.size,
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

    this.selectionManger = new SelectionManager(
      this.auxiliarLayers,
      scene,
      canvas,
      this.rubiksCube,
      () => this.onSpin()
    );

    this.ui = new GameManagerUI();

    this.onGameStateChange(GameState.STARTING);
  }

  private onGameStateChange(newState: GameState): void {
    if (newState === GameState.STARTING) {
      this.selectionManger.canSelect = false;

      this.startGame(this.difficulty, () => {
        this.onGameStateChange(GameState.PLAYING);
      });
    }

    if (newState === GameState.PLAYING) {
      this.selectionManger.canSelect = true;

      this.ui.updateGameStateDIV({
        state: GameState.PLAYING,
        spins: this.spins,
        seconds: this.seconds,
      });

      setInterval(() => {
        this.onSecond();
      }, 1000);
    }
  }

  private onSpin(): void {
    this.spins++;

    this.ui.updateGameStateDIV({
      state: GameState.PLAYING,
      spins: this.spins,
      seconds: this.seconds,
    });
  }

  private onSecond(): void {
    this.seconds++;

    this.ui.updateGameStateDIV({
      state: GameState.PLAYING,
      spins: this.spins,
      seconds: this.seconds,
    });
  }

  private async startGame(
    difficulty: Difficulty,
    onComplete: () => void
  ): Promise<void> {
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
      this.ui.updateGameStateDIV({
        state: GameState.STARTING,
        spinsLeft: moves - 1 - i,
      });

      const cubieIndex = Math.floor(Math.random() * cubies.length);
      const axisIndex = Math.floor(Math.random() * axes.length);
      const rotationIndex = Math.floor(Math.random() * rotations.length);

      await this.auxiliarLayers[axes[axisIndex]].spinCube(
        cubies[cubieIndex],
        rotations[rotationIndex],
        speed
      );
    }

    onComplete();
  }
}
