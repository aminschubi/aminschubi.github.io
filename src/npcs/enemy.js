class Enemy extends PIXI.Sprite {
    constructor(id) {
        var texture;
        switch (id) {
            case 0:
                texture = loader.resources.ghost.texture;
                console.log("X");
                break;
            default:
        }
        super(texture);
        this.x = 50 * 8;
        this.y = 50 * 8;
    }
}