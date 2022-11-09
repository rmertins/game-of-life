import {Vector2} from "three";
import {RLEPattern} from "./gol/RLEPattern";

let resetSupporters: ResetSupport[] = [];
let offsetSupportes: OffsetSupport[] = [];

class Settings {
    // GOL Settings
    public running: boolean = false;
    public reset = function () {
        console.log("RESET!!!");
        for (let i = 0; i < resetSupporters.length; i++) {
            resetSupporters[i].reset();
        }
    }
    public xOffset: number = 0;
    public yOffset: number = 0;

    public patterns: string[] = [
        "assets/patterns/boat.rle",
        "assets/patterns/cross.rle",
        "assets/patterns/herschel_climber.rle",
        "assets/patterns/z-petomino.rle"
    ]
    public currentPattern: string = this.patterns[0];

    public fov: number = 35;
    public aspect: number = 1;
    public near: number = 0.1;
    public far: number = 100;
    public camX: number = 0;
    public camY: number = 60;
    public camZ: number = 0;


    public addResetSupporter(supporter: ResetSupport): void {
        resetSupporters.push(supporter)
    }

    public addOffsetSupporter(supporter: OffsetSupport): void {
        offsetSupportes.push(supporter);
    }

    public updateOffset(): void {
        offsetSupportes.forEach(value => value.updateOffset(new Vector2(this.xOffset, this.yOffset)));
    }

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
}

interface ResetSupport {
    reset(): void;
}

interface OffsetSupport {
    updateOffset(offset: Vector2): void;
}

export { Settings, ResetSupport, OffsetSupport };