import {InstancedMesh, Mesh} from "three";

/**
 * floor visualization using an instanced mesh
 * todo: refactor all floor computation from GOLVisualization class in here
 */
export class GOLVisFloor extends InstancedMesh {

    /**
     * creates new instanced mesh
     * using given mesh geometry and material.
     * todo: should compute bounding box and size
     * @param mesh
     * @param count
     */
    constructor(mesh: Mesh | undefined, count: number) {
        super(mesh?.geometry, mesh?.material, count);
    }
}