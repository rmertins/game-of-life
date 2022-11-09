import {BoxBufferGeometry, BufferGeometry, Group, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector2} from "three";
import {GOL} from "../gol/GOL";
import {Tickable} from "../systems/Loop";
import {OffsetSupport, ResetSupport, Settings} from "../Settings";

class GOLVisualization extends Group implements Tickable, ResetSupport, OffsetSupport {
    private delay: number = 0.1;
    private pastTime: number = 0;
    private length: number = 0.25;
    private segments: number = 1;
    private padding: number = 0.05;
    private population: GOL;
    private readonly materialDead: Material;
    private readonly materialAlive: Material;
    private cells: Mesh[][];
    private settings: Settings;

    constructor(population: GOL, settings: Settings) {
        super();
        this.population = population;
        this.materialDead = new MeshBasicMaterial({color: "white", wireframe: false});
        // this.materialDead = new MeshPhongMaterial({color: "white"});
        this.materialAlive = new MeshBasicMaterial({color: "black"});
        let bGeoCube = new BoxBufferGeometry(
            this.length,
            this.length,
            this.length,
            this.segments,
            this.segments,
            this.segments
        );
        this.cells = this.initCells(bGeoCube);
        this.settings = settings;
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

    private initCells(geometry: BufferGeometry): Mesh[][] {
        let cells: Mesh[][] = [];
        for (let y = 0; y < this.population.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.population.columns; x++) {
                cells[y][x] = new Mesh(geometry, this.getCellMaterial(y, x));
                cells[y][x].position.set(this.length * x + this.padding * x, 0.5, this.length * y + this.padding * y);
                this.add(cells[y][x]);
            }
        }
        return cells;
    }

    private getCellMaterial(row: number, column: number) {
        if (this.population.isCellAlive(row, column)) {
            return this.materialAlive;
        } else {
            return this.materialDead;
        }
    }

    private updateCells() {
        for (let y = 0; y < this.population.rows; y++) {
            for (let x = 0; x < this.population.columns; x++) {
                this.cells[y][x].material = this.getCellMaterial(y, x);
            }
        }
    }
}

export {GOLVisualization};