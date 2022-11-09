import {PerspectiveCamera, Vector3} from "three";
import {Tickable} from "../systems/Loop";
import {Settings} from "../Settings";

const movePerSecond = 1;

class TickablePerspectiveCamera extends PerspectiveCamera implements Tickable {
    tick(delta: number): void {
        // this.zoom += movePerSecond * delta;
        this.updateProjectionMatrix();
        this.updateMatrix();
        // this.lookAt(new Vector3(0, 0, 5));
        // console.log(this.zoom);
    }

}

function createCamera(settings: Settings): TickablePerspectiveCamera {
    const camera = new TickablePerspectiveCamera(
        settings.fov,
        settings.aspect,
        settings.near,
        settings.far
    );

    camera.position.set(settings.camX, settings.camY, settings.camZ);
    return camera;
}

export { createCamera, TickablePerspectiveCamera };