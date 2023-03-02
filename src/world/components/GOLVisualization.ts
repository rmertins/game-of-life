import {
    AnimationAction, AnimationClip,
    AnimationMixer,
    Box3,
    Box3Helper, BoxHelper,
    Euler,
    Group,
    Material,
    Matrix4,
    Mesh,
    MeshBasicMaterial, Object3D,
    Quaternion, SkeletonHelper,
    Vector2,
    Vector3
} from "three";
import {GOL} from "../gol/GOL";
import {Tickable} from "../systems/Loop";
import {OffsetSupport, ResetSupport, Settings} from "../Settings";
import {GOLVisCell} from "./GOLVisCell";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GOLVisFloor} from "./GOLVisFloor";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export class GOLVisualization extends Group implements Tickable, ResetSupport, OffsetSupport {
    private delay: number = 0.1;
    private pastTime: number = 0;
    private population: GOL;
    private cells: GOLVisCell[][] = [];
    private readonly settings: Settings;
    private floor?: Mesh;
    private bee?: Object3D;
    private table?: Mesh;
    private golVisFloor?: GOLVisFloor;
    private beeAnimations: AnimationClip[] = [];

    constructor(population: GOL, settings: Settings) {
        super();
        this.population = population;
        this.settings = settings;
    }

    public async init() {
        const loader = new GLTFLoader();

        const [
            floorData,
            tableData,
            beeData
        ] = await Promise.all([
            loader.loadAsync('/assets/models/star_tile_floor.glb'),
            loader.loadAsync('/assets/models/wooden_center_table.glb'),
            loader.loadAsync('/assets/models/bee.glb')
        ]);

        this.floor = GOLVisualization.setupModel(floorData);
        this.bee = beeData.scene.children[0].children[0].children[0];
        this.table = GOLVisualization.setupModel(tableData);

        if (this.floor) {
            // todo: refactor into GOLVisFloor Class
            this.floor.userData['size'] = new Vector3();
            this.floor.geometry.boundingBox?.getSize(this.floor.userData['size']);
        }

        if (this.bee) {
            // todo: refactor into GOLCellVis class
            this.bee.userData['size'] = new Vector3();
            const beeBox = new Box3();
            beeBox.expandByObject(this.bee);
            beeBox.getSize(this.bee.userData['size']);
            this.beeAnimations = beeData.animations;
        }

        if (this.table != null) {
            this.table.userData['size'] = new Vector3();
            this.table.geometry.boundingBox?.getSize(this.table.userData['size']);
        }

        this.cells = this.initCells();
    }

    private static setupModel(gltf: GLTF): Mesh | undefined {
        let mesh: Mesh | undefined = undefined;
        gltf.scene.traverse(function (object) {
            if (object instanceof Mesh) {
                mesh = object as Mesh;
                mesh.geometry.computeBoundingBox();
            }
        });
        return mesh;
    }

    updateOffset(offset: Vector2): void {
        this.population.offset = offset;
        this.population.reset();
        this.updateCells();
    }

    public reset(columns?: number, rows?: number) {
        this.population.reset(columns, rows);
        if (columns === undefined && rows === undefined) {
            this.updateCells();
        } else {
            this.clearAll();
            this.cells = this.initCells();
            const newPos = this.settings.computeGolVisPosition();
            // this.position.set(newPos.x, newPos.y, newPos.z);
        }
    }

    tick(delta: number): void {
        this.pastTime += delta;

        this.updateCellsAnimation(delta);

        if (this.settings.running && this.pastTime >= this.delay) {
            this.population.tick(delta);
            this.updateCells();
            this.pastTime = 0;
        }
    }

    private initCells(): GOLVisCell[][] {
        let cells: GOLVisCell[][] = [];
        const dimension = this.settings.computeGolVisDimensions();
        let posY = 0.0;
        if (this.floor !== undefined) {
            let hasTable = 0;

            if (this.table !== undefined) {
                hasTable = 1;
                posY = (Math.max(dimension.x, dimension.z) / 3)
            }

            this.golVisFloor = new GOLVisFloor(this.floor, (this.population.rows * this.population.columns) + hasTable);
        }

        const floorScale = this.settings.cellLength / this.floor?.userData['size'].x;
        const beeScale = this.settings.cellLength / Math.max(
            this.bee?.userData['size'].x,
            this.bee?.userData['size'].y,
            this.bee?.userData['size'].z
        );

        let i = 0;
        for (let y = 0; y < this.population.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.population.columns; x++) {
                const xPos = this.settings.cellLength * x + this.settings.padding * x;
                const yPos = posY;
                const zPos = this.settings.cellLength * y + this.settings.padding * y;

                cells[y][x] = new GOLVisCell(
                    beeScale,
                    this.settings,
                    (this.bee) ? SkeletonUtils.clone( this.bee) : undefined,
                    (this.beeAnimations.length > 0) ? this.beeAnimations[0] : undefined
                );
                cells[y][x].update(this.population.isCellAlive(y, x), this.population.cellLastTransition(y, x));

                if (this.golVisFloor !== undefined) {
                    this.golVisFloor.updateMatrixAt(i, xPos, 0.0, zPos, floorScale);
                }

                cells[y][x].position.set(xPos, yPos, zPos);
                this.add(cells[y][x]);
                i++;
            }
        }

        if (this.golVisFloor !== undefined) {
            if (this.table != null) {
                this.golVisFloor.addTable(
                    this.table,
                    dimension,
                    this.settings.cellLength
                );
            }
            this.add(this.golVisFloor);
        }

        return cells;
    }

    private updateCells() {
        for (let y = 0; y < this.population.rows; y++) {
            for (let x = 0; x < this.population.columns; x++) {
                this.cells[y][x].update(this.population.isCellAlive(y, x), this.population.cellLastTransition(y, x));
            }
        }
    }

    private clearAll() {
        if (this.golVisFloor !== undefined) {
            this.remove(this.golVisFloor);
        }
        if (this.table !== undefined) {
            this.remove(this.table);
        }
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.remove(this.cells[y][x]);
            }
        }
    }

    private updateCellsAnimation(delta: number) {
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.cells[y][x].updateAnimations(delta);
            }
        }
    }
}