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

    private readonly additionalScale: number = 0.95;

    private readonly zOffset: number = -0.18;   // cellLength = 1
    private readonly yOffset: number = 0.267;

    /**
     * creates the cell by scaling, placing and rotating the model
     * @param scale cell scaling factor
     * @param cellLength current cell side length
     * @param headCrab mesh
     */
    constructor(scale: number, cellLength: number,  headCrab?: Mesh) {
        super();
        this.headCrab = headCrab;

        // console.log({
        //     scale: scale,
        //     crabScale: scale * this.additionalScale,
        //     x: 0,
        //     y: this.yOffset * cellLength,
        //     z: this.zOffset * cellLength
        // });

        scale = scale * this.additionalScale;

        if (this.headCrab != null) {
            this.headCrab.scale.set(scale, scale, scale);
            this.headCrab.position.set(0, this.yOffset * cellLength, this.zOffset * cellLength);
            this.headCrab.rotation.set(Math.PI / -2, 0, 0);
            this.headCrab.visible = false;
            this.headCrab.updateMatrixWorld();

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