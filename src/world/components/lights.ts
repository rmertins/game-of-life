import {
    AmbientLight,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    PointLight,
    RectAreaLight
} from "three";
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

function createLights(): { light: TickableDirectionalLight; ambientLight: AmbientLight } {
    // const ambientLight = new HemisphereLight('white', 'darkslategrey', 1.0);
    const ambientLight = new AmbientLight('white',  1.0);

    const light = new TickableDirectionalLight('white', 1.0);
    light.position.set(0, 2, 0);
    light.lookAt(0, 0, 0);

    // let help = new DirectionalLightHelper(light, 1, "red");

    return { ambientLight, light };
}

export { createLights, TickableDirectionalLight };