import { AxesViewer, Scene, Vector3 } from '@babylonjs/core';
import { BASE_ROTATION } from '../constants';
import { RubiksCube } from '../cube/rubiksCube';

export class CoordinateSystemHelper {
  private axesViewer: AxesViewer;

  private axesViewerInverse: AxesViewer;

  constructor(
    private readonly rubiksCube: RubiksCube,
    scene: Scene,
    size: number
  ) {
    this.axesViewer = new AxesViewer(scene, size);
    this.initAxesViewer(this.axesViewer);

    this.axesViewerInverse = new AxesViewer(scene, size);
    this.initAxesViewer(this.axesViewerInverse);

    this.axesViewerInverse.xAxis.rotate(
      new Vector3(1, 0, 0),
      BASE_ROTATION * 2
    );
    this.axesViewerInverse.yAxis.rotate(
      new Vector3(0, 1, 0),
      BASE_ROTATION * 2
    );
    this.axesViewerInverse.zAxis.rotate(
      new Vector3(0, 1, 0),
      BASE_ROTATION * 2
    );
  }

  public setVisible(isVisible: boolean): void {
    this.axesViewer.xAxis.setEnabled(isVisible);
    this.axesViewer.yAxis.setEnabled(isVisible);
    this.axesViewer.zAxis.setEnabled(isVisible);
    this.axesViewerInverse.xAxis.setEnabled(isVisible);
    this.axesViewerInverse.yAxis.setEnabled(isVisible);
    this.axesViewerInverse.zAxis.setEnabled(isVisible);
  }

  private initAxesViewer(axesViewer: AxesViewer): void {
    axesViewer.xAxis.setParent(this.rubiksCube);
    axesViewer.yAxis.setParent(this.rubiksCube);
    axesViewer.zAxis.setParent(this.rubiksCube);
    axesViewer.xAxis.position = this.rubiksCube.center;
    axesViewer.yAxis.position = this.rubiksCube.center;
    axesViewer.zAxis.position = this.rubiksCube.center;
  }
}
