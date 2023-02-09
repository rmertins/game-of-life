import {Vector2, Vector3} from "three";
import {RLEPattern} from "./gol/RLEPattern";

let resetSupporters: ResetSupport[] = [];
let offsetSupporters: OffsetSupport[] = [];

/**
 * global game settings
 */
export class Settings {
    /**
     * flag indicating running simulation
     */
    public running: boolean = false;

    /**
     * reset the game
     */
    public reset = function () {
        console.log("RESET!!!");
        for (let i = 0; i < resetSupporters.length; i++) {
            resetSupporters[i].reset();
        }
    }

    /**
     * indicates if box helpers are shown or not
     */
    public showBoxHelper: boolean = false;

    /**
     * matrix columns count
     */
    public columns: number = 200;

    /**
     * matric row count
     */
    public rows: number = 200;

    /**
     * cell side length
     */
    public cellLength: number = 0.01;

    /**
     * padding between the cells
     */
    public padding: number = 0.0;

    /**
     * pattern x offset
     */
    public xOffset: number = 0;

    /**
     * pattern y offset
     */
    public yOffset: number = 0;

    /**
     * RLE pattern files in assets
     */
    public patterns: string[] = [
        "assets/patterns/boat.rle",
        "assets/patterns/cross.rle",
        "assets/patterns/herschel_climber.rle",
        "assets/patterns/z-petomino.rle"
    ]

    /**
     * active selected pattern
     */
    public currentPattern: string = this.patterns[0];

    /**
     * camera field of view
     */
    public fov: number = 15;

    /**
     * camera aspect ratio
     */
    public aspect: number = 1;

    /**
     * camera min near distance to see
     */
    public near: number = 0.1;

    /**
     * camera max far distance to see
     */
    public far: number = 10;

    /**
     * camera position x
     */
    public camX: number = 0;

    /**
     * camera position y
     */
    public camY: number = 4;

    /**
     * camera position z
     */
    public camZ: number = 0;


    /**
     * add a reset supporter
     * @param supporter
     */
    public addResetSupporter(supporter: ResetSupport): void {
        resetSupporters.push(supporter)
    }

    /**
     * add an offset supporter
     * @param supporter
     */
    public addOffsetSupporter(supporter: OffsetSupport): void {
        offsetSupporters.push(supporter);
    }

    /**
     * updates all offset supporters with new offset
     */
    public updateOffset(): void {
        offsetSupporters.forEach(value => value.updateOffset(new Vector2(this.xOffset, this.yOffset)));
    }

    public updateDimensions() {
        resetSupporters.forEach(value => value.reset(this.columns, this.rows));
    }

    /**
     * loads asset selected RLE pattern file and prints the pattern to console
     * todo: make it usable
     */
    public updatePattern() {
        fetch(this.currentPattern)
            .then(
                function (response) {
                    response.text().then(function (text) {
                        console.log(new RLEPattern(text));
                    });
                }
            );
    }

    public computeGolVisPosition(): Vector3 {
        let position = new Vector3();
        position.x = (this.columns * this.cellLength + this.columns * this.padding) / -2
        position.z = (this.rows * this.cellLength + this.rows * this.padding) / -2
        position.y = 0;
        return position;
    }

    public computeGolVisDimensions(): Vector3 {
        let dimensons = new Vector3();
        dimensons.x = this.columns * this.cellLength + this.columns * this.padding;
        dimensons.z = this.rows * this.cellLength + this.rows * this.padding;
        dimensons.y = 0;
        return dimensons;
    }
}

/**
 * Reset support
 */
export interface ResetSupport {
    reset(columns?: number, rows?: number): void;
}

/**
 * Offset support
 */
export interface OffsetSupport {
    updateOffset(offset: Vector2): void;
}