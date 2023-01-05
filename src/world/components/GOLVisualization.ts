import {
    BoxBufferGeometry,
    BufferGeometry, Euler,
    Group,
    Material, Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D, Quaternion,
    Vector2, Vector3
} from "three";
import {GOL} from "../gol/GOL";
import {Tickable} from "../systems/Loop";
import {OffsetSupport, ResetSupport, Settings} from "../Settings";
import {GOLVisCell} from "./GOLVisCell";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GOLVisFloor} from "./GOLVisFloor";

class GOLVisualization extends Group implements Tickable, ResetSupport, OffsetSupport {
    private delay: number = 0.1;
    private pastTime: number = 0;
    private length: number = 2;
    private cellScale: number = 0.015;
    // private segments: number = 1;
    private padding: number = 0.05;
    private population: GOL;
    private readonly materialDead: Material;
    private readonly materialAlive: Material;
    private cells: GOLVisCell[][] = [];
    private settings: Settings;
    private floor?: Mesh;
    private headCrab?: Mesh;
    private golVisFloor?: GOLVisFloor;


    constructor(population: GOL, settings: Settings) {
        super();
        this.population = population;
        this.materialDead = new MeshBasicMaterial({color: "white", wireframe: false});
        // this.materialDead = new MeshPhongMaterial({color: "white"});
        this.materialAlive = new MeshBasicMaterial({color: "black"});
        // let bGeoCube = new BoxBufferGeometry(
        //     this.length,
        //     this.length,
        //     this.length,
        //     this.segments,
        //     this.segments,
        //     this.segments
        // );
        // this.cells = this.initCells(bGeoCube);
        this.settings = settings;
        //
        // this.floor = null;
        // this.headCrab = null;
        // let temp = new GOLVisCell();
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

        // console.log([floorData, headCrabData]);

        this.floor = GOLVisualization.setupModel(floorData);
        this.headCrab = GOLVisualization.setupModel(headCrabData);

        // console.log(this.floor);

        this.cells = this.initCells();
    }

    private static setupModel(gltf: GLTF): Mesh | undefined {
        let mesh: Mesh | undefined = undefined;
        gltf.scene.traverse(function (object) {
            if (object instanceof Mesh) {
                mesh = object as Mesh;
            }
        });
        return mesh;
    }

    updateOffset(offset: Vector2): void {
        this.population.offset = offset;
        this.population.reset();
        this.updateCells();
    }

    public reset() {
        this.population.reset();
        this.updateCells();
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
        let i = 0;
        for (let y = 0; y < this.population.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.population.columns; x++) {
                // cells[y][x] = new Mesh(geometry, this.getCellMaterial(y, x));
                cells[y][x] = new GOLVisCell(
                    this.cellScale,
                    this.headCrab?.clone(true)
                );
                cells[y][x].update(this.population.isCellAlive(y, x))
                const xPos = this.length * x + this.padding * x;
                const yPos = 0.1;
                const zPos = this.length * y + this.padding * y;
                if (this.golVisFloor !== undefined) {
                    const matrix = GOLVisualization.updateFloorMatrix(xPos, yPos, zPos);
                    this.golVisFloor.setMatrixAt(i, matrix);
                }
                cells[y][x].position.set(xPos, yPos, zPos);
                this.add(cells[y][x]);
                i++;
            }
        }
        if (this.golVisFloor !== undefined) {
            console.log(this.golVisFloor);
            this.golVisFloor.updateMatrix();
            this.add(this.golVisFloor);
        }
        return cells;
    }

    // private getCellMaterial(row: number, column: number) {
    //     if (this.population.isCellAlive(row, column)) {
    //         return this.materialAlive;
    //     } else {
    //         return this.materialDead;
    //     }
    // }

    private updateCells() {
        for (let y = 0; y < this.population.rows; y++) {
            for (let x = 0; x < this.population.columns; x++) {
                this.cells[y][x].update(this.population.isCellAlive(y, x));
            }
        }
    }

    private static updateFloorMatrix(x: number, y: number, z: number): Matrix4 {
        let matrix = new Matrix4();
        let position = new Vector3(x, y, z);
        let rotation = new Euler(0,0,0);
        let quaternion = new Quaternion(0,0,0, 0);
        quaternion.setFromEuler(rotation, true);
        let scale = new Vector3(0,0,0);
        matrix.compose(position, quaternion, scale);
        return matrix;
    }
}

export {GOLVisualization};