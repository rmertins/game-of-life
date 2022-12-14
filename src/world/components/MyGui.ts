import { GUI } from 'dat.gui'
import {Settings} from "../Settings";
import {Camera} from "three";

// const myGui = new GUI()
// const cubeFolder = myGui.addFolder('Cube')
// cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
// cubeFolder.open()
// const cameraFolder = myGui.addFolder('Camera')
// cameraFolder.add(camera.position, 'z', 0, 10)
// cameraFolder.open()

class MyGui extends GUI {

    constructor(settings: Settings, camera: Camera) {
        super();
        const controlsFolder = this.addFolder("Controls");
        controlsFolder.add(settings, 'running');
        controlsFolder.add(settings, 'reset');
        controlsFolder.add(settings, 'xOffset').onChange(() => {
            settings.updateOffset();
        });
        controlsFolder.add(settings, 'yOffset').onChange(() => {
            settings.updateOffset();
        });
        controlsFolder.add(settings, 'currentPattern', settings.patterns).onChange(() => {
            settings.updatePattern();
        });
        controlsFolder.open();

        const cameraFolder = this.addFolder("Camera");
        cameraFolder.add(camera, "fov", 1, 100, 1);
        cameraFolder.add(camera, "aspect", 1, 10, 0.1);
        cameraFolder.add(camera, "near", 0, 10, 0.1);
        cameraFolder.add(camera, "far", 0, 200, 1);
        cameraFolder.add(camera.position, "x", 0, 1000, 1);
        cameraFolder.add(camera.position, "y", 0, 1000, 1);
        cameraFolder.add(camera.position, "z", 0, 1000, 1);

    }
}

export { MyGui };