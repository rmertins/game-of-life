import {GOLCell, LastTransition} from "./GOLCell";
import {Vector2} from "three";
import {Tickable} from "../systems/Loop";

class GOL implements Tickable {
    private cells: GOLCell[][];
    public rows: number = 0;
    public columns: number = 0;
    public min: number;
    public max: number;
    private seedData: Vector2[] = [];
    private _offset: Vector2 = new Vector2(0,0);

    constructor(columns: number, rows: number, min: number = 2, max: number = 3) {
        this.cells = this.createCells(columns, rows);
        this.rows = rows;
        this.columns = columns;
        this.min = min;
        this.max = max;
    }

    private createCells(columns: number, rows: number): GOLCell[][] {
        let cells: GOLCell[][] = [];

        for (let y = 0; y < rows; y++) {
            cells[y] = [];
            for (let x = 0; x < columns; x++) {
                cells[y][x] = new GOLCell(new Vector2(x, y), this);
            }
        }

        return cells;
    }

    public seed(seeds: Vector2[]) {
        this.seedData = this.cloneSeed(seeds);
        for (let i = 0; i < seeds.length; i++) {
            seeds[i].add(this._offset);
            this.cells[seeds[i].y][seeds[i].x].alive = true;
            this.cells[seeds[i].y][seeds[i].x].lastTransition = LastTransition.SPAWNED;
        }
    }

    public reset(columns?: number, rows?: number) {
        if (columns !== undefined && rows !== undefined) {
            this.columns = columns;
            this.rows = rows;
        }
        this.cells = this.createCells(this.columns, this.rows);
        this.seed(this.seedData);
    }

    public newGeneration() {
        let cells: GOLCell[][] = [];
        for (let y = 0; y < this.rows; y++) {
            cells[y] = [];
            for (let x = 0; x < this.columns; x++) {
                cells[y][x] = this.cells[y][x].newGeneration();
            }
        }
        this.cells = cells;
    }

    /**
     * _|_|_      edge = row = 0 || row = row -1 || col = 0 || col = col -1
     * _|_|X
     *  | |
     *
     * pos = 2,0
     * todo: refactor only watch edges and use edge case accessible fields
     * @param position
     */
    public aliveNeighbours(position: Vector2): number {
        let alive = 0;

        // top left corner
        if (position.x == 0 && position.y == 0) {
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            alive += this.cells[position.y+1][position.x+1].alive ? 1 : 0;  // one right one down
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down
            return alive;
        }

        // top center
        if (position.y == 0 && position.x > 0 && position.x < this.columns-1) {
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            alive += this.cells[position.y+1][position.x+1].alive ? 1 : 0;  // one right one down
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down
            alive += this.cells[position.y+1][position.x-1].alive ? 1 : 0;  // one left one down

            return alive;
        }

        // top right corner
        if (position.y == 0 && position.x == this.columns-1) {
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down
            alive += this.cells[position.y+1][position.x-1].alive ? 1 : 0;  // one left one down

            return alive;
        }

        // center left
        if (position.y > 0 && position.y < this.rows-1 && position.x == 0) {
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y-1][position.x+1].alive ? 1 : 0;  // one right one up
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            alive += this.cells[position.y+1][position.x+1].alive ? 1 : 0;  // one right one down
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down

            return alive;
        }

        // center center
        if (position.y > 0 && position.y < this.rows-1 && position.x > 0 && position.x < this.columns-1) {
            alive += this.cells[position.y-1][position.x-1].alive ? 1 : 0;  // one up one left
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y-1][position.x+1].alive ? 1 : 0;  // one right one up
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            alive += this.cells[position.y+1][position.x+1].alive ? 1 : 0;  // one right one down
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down
            alive += this.cells[position.y+1][position.x-1].alive ? 1 : 0;  // one left one down
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            return alive;
        }

        // center right Allowed: row -1 & col -1 & row + 1
        if (position.y > 0 && position.y < this.rows-1 && position.x == this.columns-1) {
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y-1][position.x-1].alive ? 1 : 0;  // one up on left
            alive += this.cells[position.y+1][position.x].alive ? 1 : 0;  // one down
            alive += this.cells[position.y+1][position.x-1].alive ? 1 : 0;  // one left one down
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            return alive;
        }

        // bottom right corner
        if (position.y == this.rows-1 && position.x == this.columns-1) {
            alive += this.cells[position.y-1][position.x-1].alive ? 1 : 0;  // one up one left
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            return alive;
        }

        // bottom center
        if (position.y == this.rows-1 && position.x > 0 && position.x < this.columns-1) {
            alive += this.cells[position.y-1][position.x-1].alive ? 1 : 0;  // one up one left
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y-1][position.x+1].alive ? 1 : 0;  // one right one up
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            alive += this.cells[position.y][position.x-1].alive ? 1 : 0;    // one left
            return alive;
        }

        // bottom left corner
        if (position.y == this.rows-1 && position.x == 0) {
            alive += this.cells[position.y-1][position.x].alive ? 1 : 0;  // one up
            alive += this.cells[position.y-1][position.x+1].alive ? 1 : 0;  // one right one up
            alive += this.cells[position.y][position.x+1].alive ? 1 : 0;    // one right
            return alive;
        }

        return alive;
    }

    public isCellAlive(row: number, column: number): boolean {
        return this.cells[row][column].alive;
    }

    public cellLastTransition(row: number, column: number): LastTransition {
        return this.cells[row][column].lastTransition;
    }

    public get offset(): Vector2 {
        return this._offset;
    }

    public set offset(value: Vector2) {
        this._offset = value;
    }

    tick(delta: number): void {
        this.newGeneration();
        // console.log(this.cells);
    }

    private cloneSeed(seeds: Vector2[]) {
        let clone: Vector2[] = [];
        seeds.forEach(val => clone.push(new Vector2(val.x, val.y)));
        return clone;
    }
}

export { GOL };