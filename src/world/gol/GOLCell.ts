import {Vector2} from "three";
import {GOL} from "./GOL";

export enum LastTransition {
    SPAWNED,
    DIED,
    IDLE,
}

export class GOLCell {
    public alive: boolean = false;
    public position: Vector2;
    public lastTransition: LastTransition = LastTransition.IDLE;
    private readonly population: GOL;


    constructor(position: Vector2, population: GOL) {
        this.position = position;
        this.population = population;
    }

    public newGeneration(): GOLCell {
        let aliveNeighbours = this.population.aliveNeighbours(this.position);
        let newCell = new GOLCell(this.position, this.population);
        newCell.alive = this.alive;

        if (!this.alive && aliveNeighbours == this.population.max) {
            newCell.alive = true;
            newCell.lastTransition = LastTransition.SPAWNED;
        }

        if (this.alive && aliveNeighbours < this.population.min) {
            newCell.alive = false;
            newCell.lastTransition = LastTransition.DIED;
        }

        if (this.alive && aliveNeighbours >= this.population.min && aliveNeighbours <= this.population.max) {
            return newCell;
        }

        if (this.alive && aliveNeighbours > this.population.max) {
            newCell.alive = false;
            newCell.lastTransition = LastTransition.DIED;
        }

        return newCell;
    }


}