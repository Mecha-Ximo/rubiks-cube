import {
  GroundMesh,
  HavokPlugin,
  Mesh,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  Vector3,
} from '@babylonjs/core';
// imported from CDN due to issue with vite and WASM
// @ts-ignore
import HavokPhysics from 'https://cdn.babylonjs.com/havok/HavokPhysics_es.js';

export class PhysicsEngine {
  private readonly aggregates: PhysicsAggregate[] = [];

  constructor(private readonly scene: Scene) {}

  public async enable(ground: GroundMesh, cubies: Mesh[]): Promise<void> {
    const plugin = await this.createEngine();
    this.scene.enablePhysics(new Vector3(0, -9.8, 0), plugin);

    const physicGround = new PhysicsAggregate(
      ground,
      PhysicsShapeType.BOX,
      { mass: 0 },
      this.scene
    );
    this.aggregates.push(physicGround);

    for (const cubie of cubies) {
      const physicCubie = new PhysicsAggregate(
        cubie,
        PhysicsShapeType.BOX,
        { mass: 2, center: new Vector3(0.3, -0.2, 0.4) },
        this.scene
      );

      this.aggregates.push(physicCubie);
    }
  }

  public disable(): void {
    for (const aggregate of this.aggregates) {
      aggregate.dispose();
    }
    this.scene.disablePhysicsEngine();
  }

  private async createEngine(): Promise<HavokPlugin> {
    const hk = await HavokPhysics();
    const plugin = new HavokPlugin(true, hk);

    return plugin;
  }
}
