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

  private constructor(
    private readonly scene: Scene,
    private readonly plugin: HavokPlugin
  ) {}

  public static async createEngine(scene: Scene): Promise<PhysicsEngine> {
    const hk = await HavokPhysics();
    const plugin = new HavokPlugin(true, hk);

    return new PhysicsEngine(scene, plugin);
  }

  public enable(ground: GroundMesh, cubies: Mesh[]): void {
    this.scene.enablePhysics(new Vector3(0, -9.8, 0), this.plugin);

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
}
