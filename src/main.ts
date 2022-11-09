import { World } from "./world/World";

async function main() {
    const container = document.querySelector('#scene-container') as HTMLElement;
    const world = new World(container!);

    await world.init();

    world.start();
}

main().catch((err) => {
    console.error(err);
});