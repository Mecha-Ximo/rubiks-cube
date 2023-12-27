import { GameManager } from './gameManager';
import './index.css';
import { createScene } from './scene';

const canvas = document.querySelector('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const { scene, shadowGenerator, engine } = createScene(canvas);

new GameManager(canvas, scene, shadowGenerator);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
