import './index.css';
import { createScene } from './scene';

const canvas = document.querySelector('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

createScene(canvas);
