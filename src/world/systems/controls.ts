import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {PerspectiveCamera, Vector3} from "three";
import {Tickable} from "./Loop";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

class TickableOrbitControls extends OrbitControls implements Tickable {
    tick(delta: number): void {
        this.update();
    }
}

class TickableFirstPersonControls extends FirstPersonControls implements Tickable {
    tick(delta: number): void {
        this.update(delta);
    }
}

class TickablePointLockControls extends PointerLockControls implements Tickable {
    tick(delta: number): void {

    }
}

function createControls(camera: PerspectiveCamera, canvas: HTMLElement): TickableOrbitControls {
    const controls = new TickableOrbitControls(camera, canvas);
    // const controls = new TickablePointLockControls(camera, canvas);
    //
    // const blocker = document.getElementById( 'blocker' );
    // const instructions = document.getElementById( 'instructions' );
    //
    // if (instructions != null && blocker != null) {
    //     instructions.addEventListener('click', function () {
    //
    //         controls.lock();
    //
    //     });
    //
    //     controls.addEventListener('lock', function () {
    //
    //         instructions.style.display = 'none';
    //         blocker.style.display = 'none';
    //
    //     });
    //
    //     controls.addEventListener('unlock', function () {
    //
    //         blocker.style.display = 'block';
    //         instructions.style.display = '';
    //
    //     });
    // }

    // controls.enableDamping = true;
    // controls.target.set(0,0,10);
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 10;

    return controls;
}

export { createControls, TickableOrbitControls, TickableFirstPersonControls, TickablePointLockControls };