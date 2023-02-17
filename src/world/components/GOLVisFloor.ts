import {Box3, Euler, InstancedMesh, Matrix4, Mesh, Quaternion, Vector3} from "three";

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

    public updateMatrixAt(i: number, x: number, y: number, z: number, scaleVal: number): void {
        this.setMatrixAt(i, GOLVisFloor.updateFloorMatrix(x, y, z, scaleVal));
    }

    public addTable(table: Mesh, dimension: Vector3, cellLength: number) {
        // console.log(table.userData);
        // todo: move into parameter and compute in GolVis
        const tableHeightY = (Math.max(dimension.x, dimension.z) / 3);
        const addScale = 1.07;

        const scaleX = (dimension.x / table.userData['size'].x) * addScale;
        const scaleZ = (dimension.z / table.userData['size'].z) * addScale;
        const scaleY = tableHeightY / table.userData['size'].y;
        table.scale.set(scaleX, scaleY, scaleZ);

        // TODO: tableHeight add of 0.001 has to be proportional
        table.position.set((dimension.x / 2) - (cellLength / 2), - (tableHeightY + 0.001), (dimension.z / 2) - (cellLength / 2))
        // table.position.set((dimension.x / 2), -tableHeightY, (dimension.z / 2))
        this.position.y = tableHeightY;

        // console.log({table: table.position, floor: this.position});
        this.add(table);
    }

    private static updateFloorMatrix(x: number, y: number, z: number, scaleVal: number): Matrix4 {
        let matrix = new Matrix4();
        let position = new Vector3(x, y, z);
        let rotation = new Euler((Math.PI / 2) * -1, 0, 0);
        let quaternion = new Quaternion(0, 0, 0, 0);
        quaternion.setFromEuler(rotation, true);
        let scale = new Vector3(scaleVal, scaleVal, scaleVal);
        matrix.compose(position, quaternion, scale);
        // console.log(matrix);
        return matrix;
    }
}