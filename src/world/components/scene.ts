import {
    BackSide,
    BoxBufferGeometry,
    Color, CylinderBufferGeometry,
    LinearFilter,
    Mesh,
    Scene,
    ShaderLib,
    ShaderMaterial, SphereBufferGeometry,
    TextureLoader
} from "three";


function createScene() {
    const scene = new Scene();
    scene.background = new Color('skyblue');

    return scene;
}

export { createScene };