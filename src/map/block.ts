import { IPoint, loader, Sprite, Loader, Text } from "pixi.js";

export class Block extends Sprite {
    public type: number;
    public optionalHitBox: Sprite | undefined;
    public indexLabel: Text;

    constructor(public position: IPoint, public indexOnMap: number, blockToCopy?: any) {
        super(Loader.shared.resources.ground.texture);
        this.x = position.x;
        this.y = position.y;
        this.indexLabel = new Text(indexOnMap.toString());
        this.indexLabel.style.fill = 0xFFFFFF;

        if (blockToCopy instanceof Block)
            this.type = blockToCopy.type;
        else
            this.type = 4;

        this.changeType(this.type);
        this.addChild(this.indexLabel);
    }

    changeType(type: number) {
        /* 
            0:Ground
            1:Top/Bottom
            2:Side
            3:Connection
            4:Not Set
        */
        this.type = type;
        if (type === 0) {
            this.texture = Loader.shared.resources.ground.texture;
        } else if (type === 1) {
            this.texture = Loader.shared.resources.wall.texture;
        } else if (type === 2) {
            this.optionalHitBox = new Sprite(Loader.shared.resources.sideWallHB.texture);
            this.optionalHitBox.x = this.x + this.width / 3;
            this.optionalHitBox.y = this.y;
            this.addChild(this.optionalHitBox);
            this.texture = Loader.shared.resources.wallVertPiece.texture;
        } else if (type === 3) {
            this.texture = Loader.shared.resources.wallMidPiece.texture;
        } else if (type === 4) {
            this.texture = Loader.shared.resources.empty.texture;
        }

    }
}



export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}