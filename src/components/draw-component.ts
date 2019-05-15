import { Component } from "./component";
import { Sprite } from "pixi.js";
import { Entity } from "../entity";

export class DrawComponent extends Component {
    constructor(entity: Entity, public sprite: Sprite, x: number, y: number, angle: number, anchor: number) {
        super('draw', entity);
        this.sprite = sprite;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.angle = angle;
        this.sprite.anchor.set(anchor);
    }

    draw(view: Viewport) {
        view.addChild(this.sprite);
    }
}