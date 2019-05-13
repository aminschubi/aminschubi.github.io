import { IPoint, Point, Sprite, Loader, Rectangle } from "pixi.js";
import { Room } from "./room";
import { Block } from "./block";
import { Entity } from "../entity";
import * as Collider from "../engine/collider"
import { PlayerEntity } from "../player/playerEntity"
import { DrawComponent } from "../components/draw-component";
import { ComponentCollidable, ComponentInteractable, ComponentController } from "../components/component";
import { DrawSystem } from "../systems/draw-system";
import { systems } from "..";
import Viewport from 'pixi-viewport';

const res = Loader.shared.resources;

export class GameMap {
    private c = 0;
    public gameObjects: Block[] = [];
    public blocks: Block[] = [];
    public rooms: Room[] = [];
    public walls: any[] = [];
    public items: Entity[] = [];
    public enemies: Entity[] = [];
    public collidables: Sprite[] = [];

    public startBlockIndex = 0;

    public totalBlocksX: number;
    public totalBlocksY: number;
    public originalSize: number[] = [0, 0];
    public readonly pixelTileSize: number;

    public player: PlayerEntity

    constructor(
        private app: Viewport,
        public roomsX: number,
        public roomAmountY: number,
        public roomSize: number,
        public inputs: boolean[],
        public roomSpaceX: number,
        public roomSpaceY: number
    ) {
        this.totalBlocksX = roomsX * (roomSize + 2) + (this.roomsX - 1) * roomSpaceX;
        this.totalBlocksY = roomAmountY * (roomSize + 2) + (this.roomAmountY - 1) * roomSpaceY;
        this.originalSize = [(roomsX * (roomSize + 2)), (roomsX * (roomSize + 2))];
        this.pixelTileSize = 192;

        this.player = new PlayerEntity();
        this.player.controller = new ComponentController(this.player, inputs);
        this.app.follow(this.player.sprite);

        this.generateBlocks(this.blocks);
        this.generateRooms();
        this.spreadRooms(this.roomSpaceX, roomSpaceY);

        this.drawBlocks(this.blocks);

        this.spawnMonsters();
        this.generateItems();
    }

    generateBlocks(mapToFill: Block[]) {
        let blockMap = `\n`;
        let blockMapIndex = new Point(0, 0);
        let indexCounter = 0;
        for (let i = 0; i < this.totalBlocksY; i++) {
            for (var j = 0; j < this.totalBlocksX; j++) {
                var block = new Block(blockMapIndex, indexCounter);
                this.gameObjects.push(block);
                mapToFill.push(block);
                blockMap += `|${block.type}| `
                blockMapIndex.x += this.pixelTileSize;
                indexCounter++;
            }
            blockMap += `\n`;
            blockMapIndex.x = 0;
            blockMapIndex.y += this.pixelTileSize;
        }
        console.log("BLOCKS GENERATED!");
    }

    drawBlocks(mapToDraw: Block[]) {
        console.log("DRAW BLOCKS");
        mapToDraw.forEach(block => {
            this.app.addChild(block);
        });
    }

    logMap(mapToLog: Block[]) {
        let blockMap = `\n`;
        let c = 0;
        for (var i = 0; i < this.totalBlocksY; i++) {
            for (var j = 0; j < this.totalBlocksX; j++) {
                blockMap += `|${c}:${mapToLog[c].type}| `
                c++;
            }
            blockMap += `\n`;
        }
        console.log(blockMap);
    }

    isInView(x: number, y: number) {
        this.c++;
        let i = false;
        let pp = this.player.sprite.getGlobalPosition(new Point(), false);
        let rectangle = new Rectangle(pp.x - 1920 / 1.6, pp.y - 1080 / 1.6, 1920 * 1.3, 1080 * 1.3);
        if (this.c == 10000 && rectangle.contains(x, y)) {
            this.c = 0;
        }
        if (rectangle.contains(x, y)) {
            i = true;
        }
        return i;
    }

    generateRooms() {
        this.startBlockIndex = this.totalBlocksX + 1; //INDEX OF INNER TOPLEFT-BLOCK
        let c = 0;
        //GENERATE (roomAmount.X * roomAmountY) ROOMS
        for (let i = 0; i < this.roomsX * this.roomAmountY; i++) {
            let prevWalls: Block[][] = [[], []];

            //CHECK ROOM FOR LEFT NEIGHBOUR
            if (i > 0 && this.rooms[i - 1].walls[1].length > 0 &&
                this.blocks[this.rooms[c - 1].innerTopLeftBIndex].y == this.blocks[this.startBlockIndex].y) {
                prevWalls[0] = (this.rooms[i - 1].walls[1]);
            }

            //CHECK ROOM FOR TOP NEIGHBOUR
            if (i >= this.roomsX && this.rooms[i - this.roomsX].walls[2].length > 0 &&
                this.blocks[this.rooms[c - this.roomsX].innerTopLeftBIndex].x === this.blocks[this.startBlockIndex].x) {
                prevWalls[1] = (this.rooms[c - this.roomsX].walls[2]);
            }

            //CREATE NEW ROOM
            var room = new Room(this, this.startBlockIndex, this.roomSize, prevWalls);
            this.rooms.push(room);
            c++;

            //CHECK FOR END OF ROW -> NEXT ROW
            if (c % (this.roomsX) == 0 && i != 0) {
                this.startBlockIndex += (this.totalBlocksX * (this.roomSize + 2)) - (this.roomSize + 2) * (this.roomsX - 1);
            } else {
                this.startBlockIndex += this.roomSize + 2;
            }
            this.reloadHitBoxes();
        }
        console.log("ROOMS GENERATED!");

    }

    reloadHitBoxes() {
        this.walls = [];
        //ADD CUSTOM HITBOXES FOR VERTICAL WALLPIECES
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].type === 1 ||
                this.blocks[i].type === 3) {
                this.walls.push(this.blocks[i]);
            } else if (this.blocks[i].type === 2) {
                this.walls.push(this.blocks[i].optionalHitBox);
            }
        }
    }

    spreadRooms(x: number, y: number) {
        console.log("SPREAD ROOMS AND CLOSE SURROUNDING WALLS");
        let a = (this.roomsX - 1);
        let b = (this.roomAmountY - 1);
        for (let i = this.rooms.length - 1; i > 0; i--) {
            this.rooms[i].moveBy(x * a, y * b);
            a--;
            if (a == -1) {
                a = (this.roomsX - 1);
                b--;
            }
        }

        //CLOSE ALL WALLS AROUND
        this.surroundWalls();

    }

    surroundWalls() {
        console.log("CLOSE WALLS");
        for (let i = 0; i < this.roomsX; i++) {

            for (let j = 1; j < this.roomSize + 1; j++) {
                this.rooms[i].walls[0][j].changeType(1);
            }
            this.rooms[i].doors[0] = [];
        }
        for (let i = 0; i < this.roomAmountY * (this.roomsX - 1); i += this.roomsX) {
            for (let j = 1; j < this.roomSize + 1; j++) {
                this.rooms[i].walls[3][j].changeType(2);
            }
            this.rooms[i].doors[3] = [];
        }
        for (let i = (this.roomsX - 1); i < this.roomsX * this.roomAmountY; i += this.roomsX) {
            for (let j = 1; j < this.roomSize + 1; j++) {
                this.rooms[i].walls[1][j].changeType(1);
            }
            this.rooms[i].doors[1] = [];
        }
        for (let i = this.roomAmountY * (this.roomsX - 1); i < this.roomsX * this.roomAmountY; i++) {
            for (let j = 1; j < this.roomSize + 1; j++) {
                this.rooms[i].walls[2][j].changeType(1);
            }
            this.rooms[i].doors[2] = [];
        }
        this.reloadHitBoxes();
    }

    spawnMonsters() {
        //TESTING ENTITY COMPONENT SYSTEM//
        let ghost = new Entity();
        let g = new Sprite(res.ghost.texture);
        g.anchor.set(0.5);
        const drawComponent = new DrawComponent(ghost, g, 1200, 600, 0, 0.5);
        systems.get(DrawSystem.systemName)!.addComponent(drawComponent);
        ghost.addComponent(new ComponentCollidable(ghost, g.getBounds()));
        this.collidables.push(g);
        //ghost.print(); TODO: Format Stringify for own Classes
    }

    generateItems() {
        let itemECS = new Entity();
        let s = new Sprite(res.item.texture);
        const drawComponent = new DrawComponent(itemECS, s, 500, 500, 0, 0.5);
        systems.get(DrawSystem.systemName)!.addComponent(drawComponent);

        itemECS.addComponent(new ComponentCollidable(itemECS, s.getBounds()));
        this.collidables.push(s);
        itemECS.addComponent(new ComponentInteractable(itemECS, this.player,
            //new Sprite(res.interact.texture),
            () => {

            }));
        this.items.push(itemECS);
    }

    getItemsInRect(rectangle: any) {
        let itemsIR = [];
        let minDistToPlayer = 100000;
        let minDistItem: any;

        for (let i = 0; i < this.items.length; ++i) {
            let c = this.items[i].getComponent("draw") as DrawComponent;
            let int = this.items[i].getComponent("interactable");
            if (rectangle.containsPoint(c.sprite.getGlobalPosition(new Point(), false))) {
                itemsIR.push(int);
                let distToPlayer = Math.sqrt(
                    //@ts-ignore
                    Math.pow((this.player.sprite.getGlobalPosition().x - c.sprite.getGlobalPosition().x), 2) +
                    //@ts-ignore
                    Math.pow((this.player.sprite.getGlobalPosition().y - c.sprite.getGlobalPosition().y), 2));
                if (distToPlayer < minDistToPlayer) {
                    minDistToPlayer = distToPlayer;
                    minDistItem = int;
                }
            }
        }

        let arrays = [itemsIR, minDistItem];
        return arrays;
    }

    setColliders() {
        let t = this;

        this.walls.forEach(function (wall: Block) {
            let col = Collider.hitTestRectangle(t.player.sprite, wall);
            if (col) {
                console.log("collidedWall");
                t.player.sprite.y += t.player.move.vy * (-1);
                t.player.sprite.x += t.player.move.vx * (-1);
            }
        });

        this.items.forEach((item: Entity) => {
            let c = item.getComponent("draw") as DrawComponent;
            let col = Collider.hitTestRectangle(t.player.sprite, c.sprite);
            if (col) {
                console.log("collidedItem");
                t.player.sprite.y += t.player.move.vy * (-1);
                t.player.sprite.x += t.player.move.vx * (-1);
            }
        });

        this.collidables.forEach(function (sprite: Sprite) {
            let col = Collider.hitTestRectangle(t.player.sprite, sprite);
            if (col) {
                console.log("collidedCollidable");
                t.player.sprite.y += t.player.move.vy * (-1);
                t.player.sprite.x += t.player.move.vx * (-1);
            }
        });
    }


    update(delta: number) {
        let d = 0;
        this.gameObjects.forEach(object => {
            let p = object.getGlobalPosition(new Point(), false);
            object.visible = this.isInView(p.x, p.y);
            if (this.isInView(p.x, p.y)) {
                d++;
            }
            //console.log(object.visible);
        });
        //console.log(d);
        this.player.itemsInBounds = this.getItemsInRect(this.player.interactionField);
        this.player.update(delta);
        this.player.move.update(delta);
    }

    updateInputs(inputs: boolean[]) {
        this.inputs = inputs;
    }
}

