class Room {
    constructor(map, topLeftCornerIndex, size) {
        this.map = map;
        this.topLeftCornerIndex = topLeftCornerIndex;
        this.neighbours = [];
        this.walls = [
            [], //Top-Wall
            [], //Right-Wall
            [], //Bottom-Wall
            [] //Left-Wall
        ];
        this.sizeXY = size;
        this.miniMap = new Array(this.sizeXY * this.sizeXY);
        this.build();
    }

    build() {
        //TODO: Build up the Inner Room
        var index = this.topLeftCornerIndex;
        var internIndex = 0;
        var indexReset = this.topLeftCornerIndex + this.map.totalBlocksX;
        for (let i = 0; i < this.sizeXY; i++) {
            for (let j = 0; j < this.sizeXY; j++) {
                this.miniMap[internIndex] = this.map.blocks[index];
                var rand = getRandomIntInclusive(1, 10);
                if (rand % 2 == 0) {
                    this.miniMap[internIndex].changeType(0);
                } else {
                    this.miniMap[internIndex].changeType(0);
                }

                internIndex++;
                index++;
            }
            index = indexReset;
            indexReset += this.map.totalBlocksY;
        }
        //TODO: Build up Walls around the room
        var wallIndexTop = this.topLeftCornerIndex - this.map.totalBlocksX;
        var wallIndexRight = this.topLeftCornerIndex + this.sizeXY;
        var wallIndexBottom = this.topLeftCornerIndex + this.map.totalBlocksX * this.sizeXY;
        var wallIndexLeft = this.topLeftCornerIndex - 1;

        for (let i = 0; i < this.sizeXY; i++) {
            this.walls[0].push(this.map.blocks[wallIndexTop]);
            this.walls[1].push(this.map.blocks[wallIndexRight]);
            this.walls[2].push(this.map.blocks[wallIndexBottom]);
            this.walls[3].push(this.map.blocks[wallIndexLeft]);
            wallIndexTop++;
            wallIndexRight += this.map.totalBlocksX;
            wallIndexBottom++;
            wallIndexLeft += this.map.totalBlocksX;
        }
        console.log(this.walls);
        for (let j = 0; j < this.sizeXY; j++) {
            var rand0 = getRandomIntInclusive(0, 1);
            var rand1 = getRandomIntInclusive(0, 1);
            var rand2 = getRandomIntInclusive(0, 1);
            var rand3 = getRandomIntInclusive(0, 1);

            if (rand0 === 1) {
                this.walls[0][j].changeType(1);
            }
            if (rand1 === 1) {
                this.walls[1][j].changeType(2);
            }
            if (rand2 === 1) {
                this.walls[2][j].changeType(1);
            }
            if (rand3 === 1) {
                this.walls[3][j].changeType(2);
            }
        }

        //Check walls for how many blocks are set
        var numberOfWalls0 = 0,
            numberOfWalls1 = 0,
            numberOfWalls2 = 0,
            numberOfWalls3 = 0;

        for (let k = 0; k < this.sizeXY; k++) {
            if (this.walls[0][k].type == 1) {
                numberOfWalls0++;
            }
            if (this.walls[1][k].type == 2) {
                numberOfWalls1++;
            }
            if (this.walls[2][k].type == 1) {
                numberOfWalls2++;
            }
            if (this.walls[3][k].type == 2) {
                numberOfWalls3++;
            }
        }

        var rand = getRandomIntInclusive(0, this.sizeXY - 1);
        if (numberOfWalls0 === this.sizeXY) {
            rand = getRandomIntInclusive(0, this.sizeXY - 1);
            this.walls[0][rand].changeType(0);
        }
        if (numberOfWalls1 === this.sizeXY) {
            rand = getRandomIntInclusive(0, this.sizeXY - 1);
            this.walls[1][rand].changeType(0);
        }
        if (numberOfWalls2 === this.sizeXY) {
            rand = getRandomIntInclusive(0, this.sizeXY - 1);
            this.walls[2][rand].changeType(0);
        }
        if (numberOfWalls3 === this.sizeXY) {
            rand = getRandomIntInclusive(0, this.sizeXY - 1);
            this.walls[3][rand].changeType(0);
        }

    }
}