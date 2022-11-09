import {AxesHelper, GridHelper} from "three";

function createAxesHelper(): AxesHelper {
    const helper = new AxesHelper(3);
    helper.position.set(-16.5, 0, -16.5);
    return helper;
}

function createGridHelper(): GridHelper {
    const helper = new GridHelper(32, 32);
    return helper;
}

export { createAxesHelper, createGridHelper }