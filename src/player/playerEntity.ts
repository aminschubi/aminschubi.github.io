import { Sprite, Loader } from "pixi.js";
import { ComponentInteractable, ComponentHealth, ComponentController, ComponentCollidable, ComponentMoveable } from "../components/component";
import { Entity } from "../entity";
import { DrawComponent } from "../components/draw-component";
import { systems } from "..";
import { DrawSystem } from "../systems/draw-system";

export class PlayerEntity extends Entity {
    public attackValue: number;

    public itemsInSight: ComponentInteractable[];
    public itemsInBounds: any[];
    public nearestItem: any;

    public interacting: boolean;

    public interactionField: Sprite;

    public controller: ComponentController;
    public move: ComponentMoveable;
    public sprite: Sprite;

    constructor() {
        super();

        this.attackValue = 5;

        this.itemsInSight = [];
        this.itemsInBounds = [];

        this.interacting = false;

        this.sprite = new Sprite(Loader.shared.resources.player.texture);
        const drawComponent = new DrawComponent(this, this.sprite, 300, 300, 0, 0.5);
        systems.get(DrawSystem.systemName)!.addComponent(drawComponent);
        this.addComponent(new ComponentCollidable(this, this.sprite.getBounds()));

        this.move = new ComponentMoveable(this, 0, 0);
        this.addComponent(this.move);

        this.controller = new ComponentController(this, []);
        this.addComponent(this.controller);

        this.addComponent(new ComponentHealth(this, 100));

        this.interactionField = new Sprite(Loader.shared.resources.testhitbox.texture);
        this.interactionField.anchor.set(0.5)
        this.interactionField.x = 0;
        this.interactionField.y = -this.sprite.texture.height;
        this.sprite.addChild(this.interactionField);
    }

    update(delta: number) {
        const downState = this.controller.states[0];
        const upState = this.controller.states[1];
        const leftState = this.controller.states[2];
        const rightState = this.controller.states[3];
        const interactBState = this.controller.states[4];

        this.move.reset();

        if (downState && this.interacting === false) {
            this.move.vy = 5 * 2;
            this.sprite.angle = 180;
        }
        if (upState && this.interacting === false) {
            this.move.vy = -5 * 2;
            this.sprite.angle = 0;
        }
        if (leftState && this.interacting === false) {
            this.move.vx = -5 * 2;
            this.sprite.angle = 270;
        }
        if (rightState && this.interacting === false) {
            this.move.vx = 5 * 2;
            this.sprite.angle = 90;
        }
        if (interactBState && this.interacting === false && this.nearestItem != 0) {
            this.interact();
        }

        this.updateIF(this.itemsInBounds);
    }

    updateIF(itemsInBounds: any[]) {
        this.itemsInSight = itemsInBounds[0];
        this.nearestItem = itemsInBounds[1];

        if (this.nearestItem) {
            this.nearestItem = this.nearestItem;
            //console.log(this.nearestItem);
        } else {
            this.nearestItem = undefined;
        }
    }

    interact() {
        if (this.nearestItem != undefined) {
            this.interacting = true;
            let nextItem = this.nearestItem as ComponentInteractable;
            console.log(nextItem);
            nextItem.interact();
            var i = this;
            let t = setTimeout(function () {
                i.interacting = false;
                console.log("Hello");
            }, 100);
        }
    }
}