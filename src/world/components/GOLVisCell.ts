import {Group, Object3D} from "three";

/**
 * Visualization of a single game of life cell
 */
export class GOLVisCell extends Group {

    /**
     * cell alive model
     * @private
     */
    private readonly headCrab?: Object3D;

    /**
     * creates the cell by scaling, placing and rotating the model
     * @param scale
     * @param headCrab
     */
    constructor(scale: number, headCrab?: Object3D) {
        super();
        this.headCrab = headCrab;

        if (this.headCrab != null) {
            this.headCrab.scale.set(scale, scale, scale);
            this.headCrab.position.set(0, 0.028, -0.02);
            this.headCrab.rotation.set(Math.PI / -2, 0, 0);
            this.headCrab.visible = false;
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