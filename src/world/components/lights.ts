import {AmbientLight, DirectionalLight, HemisphereLight, PointLight, RectAreaLight} from "three";
import {Tickable} from "../systems/Loop";

const movePerSecond = 0.5;

class TickableDirectionalLight extends DirectionalLight implements Tickable {
    tick(delta: number): void {
        // this.position.x += movePerSecond * delta;
        // this.position.y += movePerSecond * delta;
        // // this.position.z += movePerSecond * delta;
        // console.log(this.position);
    }
}

function createLights(): { light: TickableDirectionalLight; ambientLight: HemisphereLight } {
    const ambientLight = new HemisphereLight('white', 'darkslategrey', 0.05);

    const light = new TickableDirectionalLight('white', 0.7);
    light.position.set(0, 10, 0);

    return { ambientLight, light };
}

export { createLights, TickableDirectionalLight };