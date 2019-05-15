import { Sprite, Rectangle } from "pixi.js";
import { Entity } from "../entity"
import { PlayerEntity } from "../player/playerEntity";
import { DrawComponent } from "./draw-component";

export abstract class Component {
    constructor(public name: string, public entity: Entity) {
    }

    update(delta: number) {
        return;
    }
}

export class ComponentCollidable extends Component {
    private hitbox: Rectangle;

    constructor(entity: Entity, hitbox: Rectangle) {
        super("collidable", entity);
        this.hitbox = hitbox;
    }
}

export class ComponentInteractable extends Component {
    public interact: Function;
    private flag: boolean;
    private player: PlayerEntity;
    //private interactSprite: Sprite;
    constructor(entity: Entity, player: PlayerEntity,/* interactSprite: Sprite, */interact: Function) {
        super("interactable", entity);
        this.flag = false;
        this.player = player;
        this.interact = interact;
    }

    update(delta: number) {
        let found;
        let i = this.player.itemsInSight;
        if (i) {
            if (i.length > 0) {
                console.log("X");
                found = i.find((element: ComponentInteractable) => element === this);
                if (this.flag === true) {
                    //this.interactSprite.visible = true;
                } else {
                    //this.interactSprite.visible = true;
                }
            }
            if (found != this) {
                this.flag = false;
                //this.interactSprite.visible = false;
            }
        }
    }
}

export class ComponentMoveable extends Component {
    private sprite: Sprite;
    public vx: number;
    public vy: number;
    constructor(entity: Entity, vx: number, vy: number) {
        super("moveable", entity);
        let c = entity.getComponent("draw") as DrawComponent;
        this.sprite = c.sprite;
        this.vx = vx;
        this.vy = vy;
    }

    update(delta: number) {
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
    }

    reset() {
        this.vx = 0;
        this.vy = 0;
    }
}

export class ComponentHealth extends Component {
    private health: number;
    constructor(entity: Entity, health: number) {
        super("health", entity);
        this.health = health;
    }
}

export class ComponentController extends Component {
    public states: boolean[]
    constructor(entity: Entity, keyboardInputs: boolean[]) {
        super("controller", entity);
        this.states = keyboardInputs;
    }
}