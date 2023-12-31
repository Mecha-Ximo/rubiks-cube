import { GameManager } from './game/gameManager';
import { PhysicsEngine } from './game/physicsEngine';
import './index.css';
import { createScene } from './scene';

const canvas = document.querySelector('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const { scene, shadowGenerator, engine, ground } = await createScene(canvas);

const physicsEngine = new PhysicsEngine(scene);
new GameManager(canvas, scene, shadowGenerator, physicsEngine, ground);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
