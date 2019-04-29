class Block extends PIXI.Sprite {
    constructor(position) {
        super(loader.resources.ground.texture);
        this.position = position;
        this.x = position[0];
        this.y = position[1];
        this.optionalHitBox;
        this.type = 0; //Not Set
    }

    changeType(type) {
        /* 
            0:Ground
            1:Top/Bottom
            2:Side
            3:Connection
        */
        this.type = type;
        if (type === 0) {
            this.texture = loader.resources.ground.texture;
        } else if (type === 1) {
            this.texture = loader.resources.wall.texture;
        } else if (type === 2) {
            this.optionalHitBox = new PIXI.Sprite(loader.resources.sideWallHB.texture);
            this.optionalHitBox.x = this.x + this.width / 3;
            this.optionalHitBox.y = this.y;
            this.parent.addChild(this.optionalHitBox);
            this.texture = loader.resources.wallVertPiece.texture;
        } else if (type === 3) {
            this.texture = loader.resources.wallMidPiece.texture;
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}