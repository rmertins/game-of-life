import {BoxHelper, Group, Mesh, Object3D, Vector3} from "three";
import {Settings} from "../Settings";

/**
 * Visualization of a single game of life cell
 */
export class GOLVisCell extends Group {

    /**
     * cell alive model
     * @private
     */
    private readonly headCrab?: Mesh;
    private readonly settings: Settings;
    private readonly boxHelper?: BoxHelper;

    private readonly additionalScale: number = 0.95;

    private readonly zOffset: number = -0.18;   // cellLength = 1
    private readonly yOffset: number = 0.267;

    /**
     * creates the cell by scaling, placing and rotating the model
     * @param scale cell scaling factor
     * @param settings using cellLength for scaling and showBoxHelper
     * @param headCrab mesh
     */
    constructor(scale: number, settings: Settings,  headCrab?: Mesh) {
        super();
        this.headCrab = headCrab;
        this.settings = settings;

        scale = scale * this.additionalScale;

        if (this.headCrab != null) {
            this.headCrab.scale.set(scale, scale, scale);
            this.headCrab.position.set(0, this.yOffset * this.settings.cellLength, this.zOffset * this.settings.cellLength);
            this.headCrab.rotation.set(Math.PI / -2, 0, 0);
            this.headCrab.visible = false;
            this.headCrab.updateMatrixWorld();

            this.add(this.headCrab)

            this.boxHelper = new BoxHelper(this.headCrab, 0xff0000);
            this.boxHelper.visible = this.settings.showBoxHelper;
            this.add(this.boxHelper);
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
        if (this.boxHelper != null) {
            this.boxHelper.visible = this.settings.showBoxHelper;
        }
    }
}