const scale = 1.0;
const app = new PIXI.Application({
    width: window.innerWidth - 25,
    height: window.innerHeight - 25
});
document.body.appendChild(app.view);

const loader = PIXI.loader
    .add("block", "../assets/block1.png")
    .add("block2", "../assets/block2.png")
    .add("wall", "../assets/wall.png")
    .add("ground", "../assets/boughtGround.png")
    .add("ground2", "../assets/boughtGround.png")
    .add("player", "../assets/player.png")
    .add("wallMidPiece", "../assets/wallMid.png")
    .add("wallVertPiece", "../assets/wallVert.png")
    .add("sideWallHB", "../assets/sideWallHitbox.png")
    .add("ghost", "../assets/ghost.png")
    .add("item", "../assets/item.png")
    .add("testhitbox", "../assets/teshitbox.png")
    .add("interact", "../assets/interact.png")
    .load(setup);

var gameObjects = [],
    keyboardInput = [false, false, false, false, false],
    map,
    player;

const b = new Bump(PIXI);

var viewport = new PIXI.extras.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight - 200,
    worldWidth: 500,
    worldHeight: 500,
    interaction: app.renderer.plugins.interaction
});
app.stage.addChild(viewport);

function setup() {
    player = new Player(loader.resources.player.texture);
    map = new Map(viewport, 10, 10, 3, player);
    viewport.follow(player.sprite);
    gameObjects.push(player);
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    player.update(delta, keyboardInput, map.getItemsInRect(player.interactionField));
    /*for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(delta, keyboardInput);
    }*/
    map.update(delta);
    map.setColliders(b);
}

window.addEventListener("keyup", onKeyUp);
window.addEventListener("keydown", onKeyDown);

function onKeyDown(key) {
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

function onKeyUp(key) {
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