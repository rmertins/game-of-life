import {MathUtils, Scene, TextureLoader, Vector2, WebGLRenderer} from "three";
import {createCamera, TickablePerspectiveCamera} from "./components/camera";
import {createScene} from "./components/scene";
import {createRenderer} from "./systems/renderer";
import {Loop} from "./systems/Loop";
import {createControls, TickableOrbitControls} from "./systems/controls";
import {createLights} from "./components/lights";
import {createAxesHelper, createGridHelper} from "./components/helpers";
import {Resizer} from "./systems/Resizer";
import {GOL} from "./gol/GOL";
import {GOLVisualization} from "./components/GOLVisualization";
import {Settings} from "./Settings";
import {MyGui} from "./components/MyGui";
import {RLEPattern} from "./gol/RLEPattern";

let textureLoader: TextureLoader;
let camera: TickablePerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let loop: Loop;
let controls: TickableOrbitControls;
let gol: GOL;
let golVis: GOLVisualization;
let settings: Settings = new Settings();
let myGUI: MyGui;

class World {
    constructor(container: HTMLElement) {
        textureLoader = new TextureLoader();
        camera = createCamera(settings);
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        controls = createControls(camera, container);
        // const pattern = new RLEPattern("#N Boat\n#O Robert Wainwright\n#C The only 5-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Boat\nx = 3, y = 3, rule = B3/S23\n2ob$obo$bo!\n");
        // const pattern = new RLEPattern("#N Cross\n#O Robert Wainwright\n#C A period 3 oscillator found in October 1989.\n#C www.conwaylife.com/wiki/index.php?title=Cross\nx = 8, y = 8, rule = B3/S23\n2b4o2b$2bo2bo2b$3o2b3o$o6bo$o6bo$3o2b3o$2bo2bo2b$2b4o!");
        // const pattern = new RLEPattern("#N (27,1)c/72 Herschel climber\n#O Unknown\n#C http://conwaylife.com/wiki/(27,1)c/72_Herschel_climber\n#C http://conwaylife.com/patterns/271c72climber.rle\nx = 115, y = 125, rule = B3/S23\n62bobo$62b2o$49bobo11bo35bobo$49b2o48b2o$50bo49bo2$113bo$112bo$112b3o\n37$43bobo$43b2o$30bobo11bo35bobo$30b2o48b2o$31bo49bo2$94bo$93bo$93b3o\n37$24bobo$24b2o$11bobo11bo35bobo$11b2o48b2o$12bo49bo2$75bo$74bo$74b3o\n14$15bo$14b3o$13b5o$13b2ob3o$14b2ob2o$3o13bo33b3o12b3o$bo49bo16bo$b3o\n47b3o11bo2bo$66b2o$66b2o$65bo2bo$65bo$67b2o!");
        const pattern = new RLEPattern("#N Achim's p8\n" +
            "#O Achim Flammenkamp\n" +
            "#C Period 8 oscillator found in July 1994.\n" +
            "x = 9, y = 9, rule = B3/S23\n" +
            "b2o6b$o8b$bo3bo3b$bo3b2o2b$3bobo3b$2b2o3bob$3bo3bob$8bo$6b2o!");
        // gol = new GOL(pattern.columns, pattern.rows);
        gol = new GOL(5, 5);
        // gol = new GOL(50, 50);
        // let seeds = [        // blinker
        //     new Vector2(3,2),
        //     new Vector2(3,3),
        //     new Vector2(3,4)
        // ];
        // let seeds = [           // gleiter 1
        //     new Vector2(2,2),
        //     new Vector2(3,3),
        //     new Vector2(4,1),
        //     new Vector2(4,2),
        //     new Vector2(4,3)
        // ];
        let seeds = [           // F-Pentomino
            new Vector2(0,1),
            new Vector2(0,2),
            new Vector2(1,0),
            new Vector2(1,1),
            new Vector2(2,1)
        ];
        // let seeds = [        // double brackets
        //     new Vector2(0, 0),
        //     new Vector2(1, 0),
        //     new Vector2(2, 0),
        //
        //     new Vector2(0, 1),
        //     new Vector2(2, 1),
        //     new Vector2(0, 2),
        //     new Vector2(2, 2),
        //
        //     new Vector2(0, 4),
        //     new Vector2(2, 4),
        //     new Vector2(0, 5),
        //     new Vector2(2, 5),
        //
        //     new Vector2(0, 6),
        //     new Vector2(1, 6),
        //     new Vector2(2, 6)
        // ];
        // gol.seed(pattern.seed);
        gol.seed(seeds);
        golVis = new GOLVisualization(gol, settings);
        golVis.position.set(-12, 0, -12);
        settings.addResetSupporter(golVis);
        settings.addOffsetSupporter(golVis);

        const { light, ambientLight } = createLights();

        loop.updatables.push(controls, camera, light, golVis);
        scene.add(light, ambientLight, createGridHelper(), createAxesHelper(), golVis);

        myGUI = new MyGui(settings, camera);

        container.append(renderer.domElement);
        /*container.onclick = function () {
            fetch("assets/patterns/boat.rle")
                .then(
                    function (response) {
                        response.text().then(function (text) {
                           console.log(new RLEPattern(text));
                        });
                    }
                );
        }*/

        const resizer = new Resizer(container, camera, renderer);
    }

    async init() {
        await golVis.init();
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }

    newGeneration() {
        gol.tick(0);
    }
}

export { World }