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

export const createScene = (
  canvas: HTMLCanvasElement
): { scene: Scene; shadowGenerator: ShadowGenerator; engine: Engine } => {
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
  camera.keysDown = [];
  camera.keysLeft = [];
  camera.keysRight = [];
  camera.keysUp = [];
  camera.attachControl(canvas, true);

  new HemisphericLight('ambient', new Vector3(0, 0, 0), scene);
  const light = new DirectionalLight('light', new Vector3(-3, -2, -3), scene);

  const shadowGenerator = new ShadowGenerator(1024, light);

  const ground = MeshBuilder.CreateGround(
    'ground',
    { width: 40, height: 40 },
    scene
  );
  ground.receiveShadows = true;

  return {
    scene,
    shadowGenerator,
    engine,
  };
};
