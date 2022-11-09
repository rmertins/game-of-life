import {Clock, PerspectiveCamera, Scene, WebGLRenderer} from "three";

const clock = new Clock();

class Loop {
    private readonly camera: PerspectiveCamera;
    private readonly scene: Scene;
    private renderer: WebGLRenderer;
    public updatables: Tickable[];

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();

        for (const tickable of this.updatables) {
            tickable.tick(delta);
        }
    }
}

interface Tickable {
    tick(delta: number): void;
}

export { Loop, Tickable };