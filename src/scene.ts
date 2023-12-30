import {
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';

export const createScene = (
  canvas: HTMLCanvasElement
): { scene: Scene; shadowGenerator: ShadowGenerator; engine: Engine } => {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.2, 0.2, 0.2, 0.5);

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
    { width: 100, height: 100 },
    scene
  );
  ground.receiveShadows = true;
  const groundMaterial = new StandardMaterial('ground-material', scene);
  groundMaterial.diffuseColor = new Color3(0.9, 0.9, 0.9);
  ground.material = groundMaterial;

  // Inspector.Show(scene, {});
  // scene.debugLayer.show();

  return {
    scene,
    shadowGenerator,
    engine,
  };
};
