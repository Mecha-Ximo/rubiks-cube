import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core';

export const createScene = (canvas: HTMLCanvasElement): Scene => {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    'camera',
    Math.PI / 2,
    Math.PI / 2,
    2,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);

  const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);

  engine.runRenderLoop(() => {
    scene.render();
  });

  return scene;
};
