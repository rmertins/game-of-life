import {Group, Mesh, Object3D, Vector3} from "three";

export class GOLVisCell extends Group {

    private readonly floor?: Object3D;
    private readonly headCrab?: Object3D;


    constructor(scale: number, floor?: Object3D, headCrab?: Object3D) {
        super();
        this.floor = floor;
        this.headCrab = headCrab;

        if (this.floor != null) {
            this.floor.scale.set(scale, scale, scale);
            this.add(this.floor);
        }

        if (this.headCrab != null) {
            this.headCrab.scale.set(0.5, 0.5, 0.5);
            this.headCrab.position.set(0, 0.5, 0);
            this.headCrab.visible = false;
            this.add(this.headCrab)
        }
    }

    public update(alive: boolean): void {
        if (this.headCrab != null) {
            this.headCrab.visible = alive;
        }
    }
}