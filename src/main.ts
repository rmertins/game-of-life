import { World } from "./world/World";

/**
 * initalize and place the game
 * start the game loop
 */
async function main() {
    const container = document.querySelector('#scene-container') as HTMLElement;
    const world = new World(container!);

    await world.init();

    world.start();
}

/**
 * catch all error and print to console out
 */
main().catch((err) => {
    console.error(err);
});