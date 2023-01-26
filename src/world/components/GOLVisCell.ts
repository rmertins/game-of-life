import {Group, Mesh, Object3D, Vector3} from "three";

/**
 * Visualization of a single game of life cell
 */
export class GOLVisCell extends Group {

    /**
     * cell alive model
     * @private
     */
    private readonly headCrab?: Mesh;

    /**
     * creates the cell by scaling, placing and rotating the model
     * @param scale
     * @param headCrab
     */
    constructor(scale: number, headCrab?: Mesh) {
        super();
        this.headCrab = headCrab;

        if (this.headCrab != null) {
            this.headCrab.scale.set(scale, scale, scale);
            this.headCrab.position.set(0, 0, 0);
            this.headCrab.rotation.set(Math.PI / -2, 0, 0);
            this.headCrab.visible = false;
            // this.headCrab.updateMatrix();

            this.userData['size'] = new Vector3();
            this.headCrab.geometry.computeBoundingBox();
            this.headCrab.geometry.boundingBox?.getSize(this.userData['size']);

            this.add(this.headCrab)
        }
    }

    /**
     * updates visualization makes headcrab visible or invisible
     * regarding alive state
     * @param alive
     */
    public update(alive: boolean): void {
        if (this.headCrab != null) {
            this.headCrab.visible = alive;
        }
    }
}