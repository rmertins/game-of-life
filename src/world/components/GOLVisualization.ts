import {
    Box3Helper, BoxHelper,
    Euler,
    Group,
    Material,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    Quaternion,
    Vector2,
    Vector3
} from "three";
import {GOL} from "../gol/GOL";
import {Tickable} from "../systems/Loop";
import {OffsetSupport, ResetSupport, Settings} from "../Settings";
import {GOLVisCell} from "./GOLVisCell";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GOLVisFloor} from "./GOLVisFloor";

export class GOLVisualization extends Group implements Tickable, ResetSupport, OffsetSupport {
    private delay: number = 0.1;
    private pastTime: number = 0;
    private population: GOL;
    private cells: GOLVisCell[][] = [];
    private boxHelpers: BoxHelper[] = [];
    private settings: Settings;
    private floor?: Mesh;
    private headCrab?: Mesh;
    private golVisFloor?: GOLVisFloor;

    constructor(population: GOL, settings: Settings) {
        super();
        this.population = population;
        this.settings = settings;
    }

    public async init() {
        const loader = new GLTFLoader();

        const [
            floorData,
            headCrabData
        ] = await Promise.all([
            loader.loadAsync('/assets/models/star_tile_floor.glb'),
            loader.loadAsync('/assets/models/headcrab.glb')
        ]);

        this.floor = GOLVisualization.setupModel(floorData);
        this.headCrab = GOLVisualization.setupModel(headCrabData);

        if (this.floor) {
            // todo: refactor into GOLVisFloor Class
            this.floor.userData['size'] = new Vector3();
            this.floor.geometry.boundingBox?.getSize(this.floor.userData['size']);
        }

        if (this.headCrab) {
            // todo: refactor into GOLCellVis class
            this.headCrab.userData['size'] = new Vector3();
            this.headCrab.geometry.boundingBox?.getSize(this.headCrab.userData['size']);
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
        }
    }

    tick(delta: number): void {
        this.pastTime += delta;

        if (this.settings.running && this.pastTime >= this.delay) {
            this.population.tick(delta);
            this.updateCells();
            this.pastTime = 0;
        }
    }

    private initCells(): GOLVisCell[][] {
        let cells: GOLVisCell[][] = [];

        if (this.floor !== undefined) {
            this.golVisFloor = new GOLVisFloor(this.floor, this.population.rows * this.population.columns);
        }

        const floorScale = this.settings.cellLength / this.floor?.userData['size'].x;
        const headCrabScale = this.settings.cellLength / this.headCrab?.userData['size'].y;

        let i = 0;
        for (let y = 0; y < this.population.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.population.columns; x++) {
                const xPos = this.settings.cellLength * x + this.settings.padding * x;
                const yPos = 0.1;
                const zPos = this.settings.cellLength * y + this.settings.padding * y;

                cells[y][x] = new GOLVisCell(
                    headCrabScale,
                    this.settings.cellLength,
                    this.headCrab?.clone(true)
                );
                cells[y][x].update(this.population.isCellAlive(y, x));

                if (this.golVisFloor !== undefined) {
                    this.golVisFloor.updateMatrixAt(i, xPos, yPos, zPos, floorScale);
                }

                cells[y][x].position.set(xPos, yPos, zPos);
                this.add(cells[y][x]);

                if (this.settings.showBoxHelper) {
                    // todo: figure out why they have the wrong position
                    const boxHelper = new BoxHelper(cells[y][x], 0xff0000);
                    this.add(boxHelper);
                    this.boxHelpers.push(boxHelper);
                }

                i++;
            }
        }

        if (this.golVisFloor !== undefined) {
            this.golVisFloor.updateMatrix();
            this.add(this.golVisFloor);
        }

        return cells;
    }

    private updateCells() {
        for (let y = 0; y < this.population.rows; y++) {
            for (let x = 0; x < this.population.columns; x++) {
                this.cells[y][x].update(this.population.isCellAlive(y, x));
            }
        }
    }

    private clearAll() {
        if (this.golVisFloor !== undefined) {
            this.remove(this.golVisFloor);
        }
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.remove(this.cells[y][x]);
            }
        }

        if (this.settings.showBoxHelper) {
            this.boxHelpers.forEach(boxHelper => this.remove(boxHelper));
            this.boxHelpers = [];
        }
    }
}