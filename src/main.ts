import { Color3, Color4, StandardMaterial } from '@babylonjs/core';
import './index.css';
import { createScene } from './scene';

const canvas = document.querySelector('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const scene = createScene(canvas);
scene.clearColor = new Color4(0.8, 0.8, 0.8, 0.5);

canvas.addEventListener('pointerdown', function (evt) {
  const pickResult = scene.pick(scene.pointerX, scene.pointerY);
  if (pickResult.hit) {
    const selectedObject = pickResult.pickedMesh;
    console.log('Selected object:', selectedObject?.name ?? null);

    if (selectedObject && selectedObject.name !== 'ground') {
      const currentMaterial = selectedObject.material;
      const selectionMaterial = new StandardMaterial('selected', scene);
      selectionMaterial.diffuseColor = new Color3(0.1, 0.7, 0.5);
      selectedObject.material = selectionMaterial;
    }
  }
});
