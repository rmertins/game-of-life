import {Euler, InstancedMesh, Matrix4, Mesh, Quaternion, Vector3} from "three";

/**
 * floor visualization using an instanced mesh
 */
export class GOLVisFloor extends InstancedMesh {

    /**
     * creates new instanced mesh
     * using given mesh geometry and material.
     * @param mesh
     * @param count
     */
    constructor(mesh: Mesh | undefined, count: number) {
        super(mesh?.geometry, mesh?.material, count);
    }

    public updateMatrixAt(i: number, x: number, y:number, z: number, scaleVal: number): void {
        this.setMatrixAt(i, GOLVisFloor.updateFloorMatrix(x, y, z, scaleVal));
    }

    private static updateFloorMatrix(x: number, y: number, z: number, scaleVal: number): Matrix4 {
        let matrix = new Matrix4();
        let position = new Vector3(x, y, z);
        let rotation = new Euler((Math.PI / 2) * -1, 0, 0);
        let quaternion = new Quaternion(0, 0, 0, 0);
        quaternion.setFromEuler(rotation, true);
        let scale = new Vector3(scaleVal, scaleVal, scaleVal);
        matrix.compose(position, quaternion, scale);
        return matrix;
    }
}