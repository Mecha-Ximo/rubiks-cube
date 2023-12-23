import {
  ArcRotateCamera,
  DirectionalLight,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import { createCube } from './rubikCube';

export const createScene = (canvas: HTMLCanvasElement): Scene => {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    'camera',
    Math.PI / 4,
    Math.PI / 4,
    20,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  const ambient = new HemisphericLight('ambient', new Vector3(0, 0, 0));
  const light = new DirectionalLight('light', new Vector3(-3, -2, -3), scene);
  // light.position.y = 10;
  const shadowGenerator = new ShadowGenerator(1024, light);

  // const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
  const cube = createCube(scene, shadowGenerator);

  const ground = MeshBuilder.CreateGround(
    'ground',
    { width: 40, height: 40 },
    scene
  );
  ground.receiveShadows = true;

  engine.runRenderLoop(() => {
    scene.render();
  });

  return scene;
};
