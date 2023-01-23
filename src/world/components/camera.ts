import {PerspectiveCamera, Vector3} from "three";
import {Tickable} from "../systems/Loop";
import {Settings} from "../Settings";

/**
 * Perspective camera using animation loop Tickable interface
 */
export class TickablePerspectiveCamera extends PerspectiveCamera implements Tickable {

    /**
     * updates the matrix
     * @param delta
     */
    tick(delta: number): void {
        this.updateProjectionMatrix();
        this.updateMatrix();
    }

}

/**
 * creates a new camery instance using settings
 * places the camera on settings cam position
 * @param settings
 */
export function createCamera(settings: Settings): TickablePerspectiveCamera {
    const camera = new TickablePerspectiveCamera(
        settings.fov,
        settings.aspect,
        settings.near,
        settings.far
    );

    camera.position.set(settings.camX, settings.camY, settings.camZ);
    return camera;
}