import {
    BoxBufferGeometry,
    BufferGeometry,
    Group,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D,
    Vector2
} from "three";
import {GOL} from "../gol/GOL";
import {Tickable} from "../systems/Loop";
import {OffsetSupport, ResetSupport, Settings} from "../Settings";
import {GOLVisCell} from "./GOLVisCell";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

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
    private floor?: Object3D;
    private headCrab?: Object3D;

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

        console.log(this.floor);

        this.cells = this.initCells();
    }

    private static setupModel(gltf: GLTF): Object3D {
        // gltf.scene.traverseAncestors(function (object) {
        //     if (object instanceof Mesh) {
        //         return object as Mesh;
        //     }
        // })
        // return undefined;
        let obj3D: Object3D = gltf.scene.children[0];
        obj3D.position.set(0, 0, 0);
        return obj3D;
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
        for (let y = 0; y < this.population.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.population.columns; x++) {
                // cells[y][x] = new Mesh(geometry, this.getCellMaterial(y, x));
                cells[y][x] = new GOLVisCell(
                    this.cellScale,
                    this.floor?.clone(true),
                    this.headCrab?.clone(true)
                );
                cells[y][x].update(this.population.isCellAlive(y, x))
                cells[y][x].position.set(
                    this.length * x + this.padding * x,
                    0.1,
                    this.length * y + this.padding * y);
                this.add(cells[y][x]);
            }
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
}

export {GOLVisualization};