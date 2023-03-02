import {AnimationAction, AnimationClip, AnimationMixer, AnimationUtils, BoxHelper, Group, Object3D} from "three";
import {Settings} from "../Settings";
import {LastTransition} from "../gol/GOLCell";

/**
 * Visualization of a single game of life cell
 */
export class GOLVisCell extends Group {

    /**
     * cell alive model
     * @private
     */
    private readonly bee?: Object3D;
    private readonly settings: Settings;
    private readonly boxHelper?: BoxHelper;
    private readonly aniIdleClip?: AnimationClip;
    private aniCurrentAction?: AnimationAction;
    private readonly aniSpawnAndDieClip?: AnimationClip;
    private readonly aniDieClip?: AnimationClip;
    private readonly aniSpawnClip?: AnimationClip;
    private readonly mixer?: AnimationMixer;

    private readonly additionalScale: number = 0.95;

    private readonly zOffset: number = 0.40;   // cellLength = 1
    private readonly yOffset: number = 0.4;

    /**
     * creates the cell by scaling, placing and rotating the model
     * @param scale cell scaling factor
     * @param settings using cellLength for scaling and showBoxHelper
     * @param bee the active cell visualization model
     * @param aniIdle animation clip for visible idle cells
     * @param aniSpawnAndDie animation clip for spawning and die cells
     */
    constructor(scale: number,
                settings: Settings,
                bee?: Object3D,
                aniIdle?: AnimationClip,
                aniSpawnAndDie?: AnimationClip) {
        super();
        this.bee = bee;
        this.settings = settings;
        this.aniIdleClip = aniIdle;
        this.aniSpawnAndDieClip = aniSpawnAndDie;

        if (this.aniSpawnAndDieClip != null) {
            this.aniDieClip = AnimationUtils.subclip(this.aniSpawnAndDieClip, "die", 0, 137);
            this.aniSpawnClip = AnimationUtils.subclip(
                this.aniSpawnAndDieClip,
                "spawn",
                138,
                274
            );
        }


        scale = scale * this.additionalScale;

        if (this.bee != null) {
            this.bee.scale.set(scale, scale, scale);
            this.position.set(
                0,
                this.yOffset * this.settings.cellLength,
                this.zOffset * this.settings.cellLength
            );
            this.bee.rotation.set(0, 0, 0);
            this.bee.visible = false;
            this.updateMatrix();
            this.mixer = new AnimationMixer(this.bee);
            if (this.aniIdleClip != null) {
                this.aniCurrentAction = this.mixer.clipAction(this.aniIdleClip);
            }
            // if (this.aniDieClip != null) {
            //     this.aniCurrentAction = this.mixer.clipAction(this.aniDieClip);
            //     this.aniCurrentAction.setDuration(5)
            //     this.aniCurrentAction.play();
            // }

            this.add(this.bee);

            this.boxHelper = new BoxHelper(this, 0xff0000);
            this.boxHelper.visible = this.settings.showBoxHelper;
            this.add(this.boxHelper);
        }
    }

    /**
     * updates visualization makes headcrab visible or invisible
     * regarding alive state
     * @param alive
     * @param lastTransition
     */
    public update(alive: boolean, lastTransition: LastTransition): void {
        switch (lastTransition) {
            case LastTransition.IDLE:
                if (this.aniIdleClip != null) {
                    this.aniCurrentAction = this.mixer?.clipAction(this.aniIdleClip);
                }
                break;
            case LastTransition.SPAWNED:
                if (this.aniSpawnClip != null) {
                    this.aniCurrentAction = this.mixer?.clipAction(this.aniSpawnClip);
                }
                break;
            case LastTransition.DIED:
                if (this.aniDieClip != null) {
                    this.aniCurrentAction = this.mixer?.clipAction(this.aniDieClip);
                }
                break;
        }

        if (this.bee != null) {
            this.bee.visible = alive;
            if (alive) {
                this.aniCurrentAction?.play();
            } else {
                this.aniCurrentAction?.stop();
            }
        }
        if (this.boxHelper != null) {
            this.boxHelper.visible = this.settings.showBoxHelper;
        }
    }

    public updateAnimations(delta: number): void {
        this.mixer?.update(delta);
    }
}