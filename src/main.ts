import { Color4, Mesh } from '@babylonjs/core';
import { Layer } from './cube/layer';
import './index.css';
import { createCube } from './rubikCube';
import { createScene } from './scene';

const canvas = document.querySelector('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const { scene, shadowGenerator, engine } = createScene(canvas);
scene.clearColor = new Color4(0.8, 0.8, 0.8, 0.5);

const cube = createCube(scene, shadowGenerator, 4);
const auxLayer = new Layer({ name: 'aux-layer', rubik: cube, scene });

canvas.addEventListener('click', function () {
  const pickResult = scene.pick(scene.pointerX, scene.pointerY);
  if (pickResult.hit) {
    const selectedObject = pickResult.pickedMesh;

    if (selectedObject && selectedObject.name !== 'ground') {
      const zPos = selectedObject.position.z;
      const cubies = cube.getChildren((n): n is Mesh => n instanceof Mesh);
      const layerCubies = cubies.filter((c) => c.position.z === zPos);
      auxLayer.spinCubes(layerCubies);

      // const currentMaterial = selectedObject.material;
      // const selectionMaterial = new StandardMaterial('selected', scene);
      // selectionMaterial.diffuseColor = new Color3(0.1, 0.7, 0.5);
      // selectedObject.material = selectionMaterial;
    }
  }
});

engine.runRenderLoop(() => {
  scene.render();
});
