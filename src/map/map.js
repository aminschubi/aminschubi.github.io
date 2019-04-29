class Map {
    constructor(app, roomAmountX, roomAmountY, roomSize, player) {
        this.app = app;

        this.blocks = [];
        this.rooms = [];
        this.walls = [];
        this.items = [];
        this.enemies = [];

        this.roomIndex = 0;
        this.roomSize = roomSize;
        this.roomAmountX = roomAmountX;
        this.roomAmountY = roomAmountY;

        this.totalBlocksX = roomAmountX * roomSize + roomAmountX + 1;
        this.totalBlocksY = roomAmountY * roomSize + roomAmountY + 1;
        this.blockMapIndex = [0, 0];
        this.pixelTileSize = 192;

        this.generateBlocks();
        this.generateRooms();
        this.spawnMonsters();
        this.generateItems();

        this.player = player;
        this.app.addChild(this.player.sprite);
    }

    generateBlocks() {
        for (var i = 0; i < this.totalBlocksY; i++) {
            for (var j = 0; j < this.totalBlocksX; j++) {
                var block = new Block(this.blockMapIndex);
                this.app.addChild(block);
                this.blocks.push(block);
                this.blockMapIndex[0] += this.pixelTileSize;
            }
            this.blockMapIndex[0] = 0;
            this.blockMapIndex[1] += this.pixelTileSize;
        }
    }

    generateRooms() {
        this.roomIndex = this.totalBlocksX + 1;
        var startIndex = this.roomIndex;

        //Create Rooms with walls
        for (let i = 0; i < this.roomAmountY; i++) {
            for (let j = 0; j < this.roomAmountX; j++) {
                console.log(this.roomIndex);
                var room = new Room(this, this.roomIndex, this.roomSize);
                this.rooms.push(room);
                this.roomIndex += this.roomSize;
                this.roomIndex++;
            }
            this.roomIndex = startIndex + (this.roomSize + 1) * this.totalBlocksX;
            startIndex = this.roomIndex;
        }

        //Top Wall
        var checkers = (this.roomSize + 1) * this.totalBlocksX;
        for (var x = 0; x < this.totalBlocksX; x++) {
            this.blocks[x].changeType(1);
        }
        //Fill Corners between Rooms and Left and Right Wall
        for (var y = 0; y < this.totalBlocksY * this.totalBlocksX - this.totalBlocksX + 1; y += this.totalBlocksX) {
            this.blocks[y].changeType(2);
            this.blocks[y + this.totalBlocksX - 1].changeType(2);
            if (y % checkers == 0) {
                for (var z = y; z < y + this.totalBlocksX; z += this.roomSize + 1) {
                    this.blocks[z].changeType(3);
                }
            }
        }
        //Bottom Wall
        for (var j = this.totalBlocksX * this.totalBlocksY - this.totalBlocksX; j < this.totalBlocksX * this.totalBlocksY; j++) {
            this.blocks[j].changeType(1);
        }

        //add hitbox-sprite for vertical wall pieces
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].type === 1 ||
                this.blocks[i].type === 3) {
                this.walls.push(this.blocks[i]);
            } else if (this.blocks[i].type === 2) {
                this.walls.push(this.blocks[i].optionalHitBox);
            }
        }
    }

    spawnMonsters() {
        var enemy = new Enemy(0);
        this.app.addChild(enemy);
    }

    generateItems() {
        var item = new Item(0, 400, 400);
        this.items.push(item);
        this.app.addChild(item);
        var item = new Item(0, 450, 400);
        this.items.push(item);
        this.app.addChild(item);
        var item = new Item(0, 600, 600);
        this.items.push(item);
        this.app.addChild(item);
    }

    getItemsInRect(rectangle) {
        let itemsIR = [];
        let interactableObjects = [];
        let minDistToPlayer = 100000;
        let minDistItem = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (rectangle.containsPoint(this.items[i].getGlobalPosition())) {
                itemsIR.push(this.items[i]);
                if (this.items[i].properties.find(element => element === "interact")) {
                    interactableObjects.push(this.items[i]);
                    let distToPlayer = Math.sqrt(
                        Math.pow((this.player.sprite.getGlobalPosition().x - this.items[i].getGlobalPosition().x), 2) +
                        Math.pow((this.player.sprite.getGlobalPosition().y - this.items[i].getGlobalPosition().y), 2));
                    if (distToPlayer < minDistToPlayer) {
                        minDistToPlayer = distToPlayer;
                        minDistItem = this.items[i];
                    }
                }
            }
        }

        let arrays = [itemsIR, interactableObjects, minDistItem];
        //console.log(arrays);
        return arrays;
    }

    setColliders(b) {
        b.hit(this.player.sprite, this.walls, true, false, true, function (collision, sprite) {
            console.log(`Y: ${sprite.x}`);
        });
        b.hit(this.player.interactionField, this.walls, false, false, true, function (collision, sprite) {
            console.log(`X: ${sprite.x}`);
        });
        b.hit(this.player.sprite, this.items, true, false, true, function (collision, sprite) {
            console.log(`Y: ${sprite.x}`);
        });
    }

    update(delta) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].update(delta, this.player.itemsInSight);
        }
    }
}