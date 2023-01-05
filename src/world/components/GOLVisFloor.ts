import {InstancedMesh, Mesh} from "three";

export class GOLVisFloor extends InstancedMesh {

    constructor(mesh: Mesh | undefined, count: number) {
        super(mesh?.geometry, mesh?.material, count);
    }
}