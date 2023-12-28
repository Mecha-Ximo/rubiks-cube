import { AxesViewer, Scene } from '@babylonjs/core';
import { RubiksCube } from '../cube/rubiksCube';

export class CoordinateSystemHelper extends AxesViewer {
  constructor(
    private readonly rubiksCube: RubiksCube,
    scene: Scene,
    size: number
  ) {
    super(scene, size);
    this.xAxis.setParent(this.rubiksCube);
    this.yAxis.setParent(this.rubiksCube);
    this.zAxis.setParent(this.rubiksCube);
    this.xAxis.position = this.rubiksCube.center;
    this.yAxis.position = this.rubiksCube.center;
    this.zAxis.position = this.rubiksCube.center;
  }

  public setVisible(isVisible: boolean): void {
    this.xAxis.setEnabled(isVisible);
    this.yAxis.setEnabled(isVisible);
    this.zAxis.setEnabled(isVisible);
  }
}
