import { GameMap } from './map/game-map';
import { Application, Loader } from 'pixi.js';
import Viewport from 'pixi-viewport';
import { System } from './systems/system';
import { Component } from './components/component';
import { DrawSystem } from './systems/draw-system';

const app = new Application({
    width: window.innerWidth - 25,
    height: window.innerHeight - 25
});
document.body.appendChild(app.view);
var viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight - 200,
    worldWidth: 500,
    worldHeight: 500,
    interaction: app.renderer.plugins.interaction
});

export const systems = new Map<string, System<Component>>();
systems.set(DrawSystem.systemName, new DrawSystem(viewport));

Loader.shared
    .add("block1", require("../assets/block1.png"))
    .add("block2", require("../assets/block2.png"))
    .add("wall", require("../assets/wall.png"))
    .add("ground", require("../assets/boughtGround.png"))
    .add("ground2", require("../assets/boughtGround.png"))
    .add("player", require("../assets/player.png"))
    .add("wallMidPiece", require("../assets/wallMid.png"))
    .add("wallVertPiece", require("../assets/wallVert.png"))
    .add("wallLeft", require("../assets/wallVertLeft.png"))
    .add("wallRight", require("../assets/wallVertRight.png"))
    .add("sideWallHB", require("../assets/sideWallHitbox.png"))
    .add("ghost", require("../assets/ghost.png"))
    .add("item", require("../assets/item.png"))
    .add("testhitbox", require("../assets/teshitbox.png"))
    .add("interact", require("../assets/interact.png"))
    .add("empty", require("../assets/empty.png"))
    .load(setup);

let gameObjects: any[] = [],
    keyboardInput = [false, false, false, false, false],
    map: GameMap;

app.stage.addChild(viewport);

function setup() {
    map = new GameMap(viewport, 10, 10, 5, keyboardInput, 3, 2);
    gameObjects.push(map.player);
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta: number) {
    map.updateInputs(keyboardInput);
    map.update(delta);
    map.setColliders();
    systems.forEach(system => system.update(delta));
}

window.addEventListener("keyup", onKeyUp);
window.addEventListener("keydown", onKeyDown);

function onKeyDown(key: KeyboardEvent) {
    if (key.keyCode === 87) { //W
        keyboardInput[1] = true;
    }
    if (key.keyCode === 65) { //A
        keyboardInput[2] = true;
    }
    if (key.keyCode === 83) { //S
        keyboardInput[0] = true;
    }
    if (key.keyCode === 68) { //D
        keyboardInput[3] = true;
    }
    if (key.keyCode === 69) { //E
        keyboardInput[4] = true;
    }
}

function onKeyUp(key: KeyboardEvent) {
    if (key.keyCode === 87) { //W
        keyboardInput[1] = false;
    }
    if (key.keyCode === 65) { //A
        keyboardInput[2] = false;
    }
    if (key.keyCode === 83) { //S
        keyboardInput[0] = false;
    }
    if (key.keyCode === 68) { //D
        keyboardInput[3] = false;
    }
    if (key.keyCode === 69) { //E
        keyboardInput[4] = false;
    }
}