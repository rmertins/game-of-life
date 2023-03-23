import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    AnimationUtils,
    BoxHelper,
    Group,
    LoopOnce,
    Object3D
} from "three";
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

    private currentTransition: LastTransition = LastTransition.IDLE;

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
            this.aniDieClip.tracks.shift();
            console.log(this.aniDieClip);
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
                this.currentTransition = LastTransition.IDLE;
            }

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
        if (this.currentTransition != lastTransition) {
            switch (lastTransition) {
                case LastTransition.SPAWNED:
                    this.spawn();
                    break;
                case LastTransition.DIED:
                    this.died();
                    break;
                case LastTransition.IDLE:
                    if (this.bee != null) {
                        this.bee.visible = alive;
                    }
                    break;
            }
        }

        if (this.boxHelper != null) {
            this.boxHelper.visible = this.settings.showBoxHelper;
        }
    }

    public updateAnimations(delta: number): void {
        this.mixer?.update(delta);
        // console.log(this.aniCurrentAction?.isRunning());
        if (this.currentTransition == LastTransition.SPAWNED && !this.aniCurrentAction?.isRunning()) {
            this.idle();
        }

        if (this.currentTransition == LastTransition.DIED && !this.aniCurrentAction?.isRunning()) {
            if (this.bee) {
                this.bee.visible = false;
            }
        }
    }

    private spawn(): void {
        if (this.bee) {
            this.bee.visible = true;
        }

        if (this.aniSpawnClip) {
            this.aniCurrentAction = this.mixer?.clipAction(this.aniSpawnClip);
            this.aniCurrentAction?.setLoop(LoopOnce, 1);
            this.aniCurrentAction?.reset();
            this.aniCurrentAction?.play();
        }

        this.currentTransition = LastTransition.SPAWNED;
    }

    private idle() {

        let lastAction;
        if (this.aniCurrentAction) {
            lastAction = this.aniCurrentAction;
        }

        if (this.aniIdleClip) {
            this.aniCurrentAction = this.mixer?.clipAction(this.aniIdleClip);
            this.aniCurrentAction?.reset();
            this.aniCurrentAction?.play();
        }

        this.currentTransition = LastTransition.IDLE;
    }

    private died() {
        if (this.aniDieClip) {
            this.aniCurrentAction = this.mixer?.clipAction(this.aniDieClip);
            this.aniCurrentAction?.setLoop(LoopOnce, 1);
            this.aniCurrentAction?.reset();
            this.aniCurrentAction?.play();
        }

        this.currentTransition = LastTransition.DIED;
    }
}