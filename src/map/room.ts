import { GameMap } from './game-map';
import { getRandomIntInclusive, Block } from './block';

export class Room {
    public blocks: Block[] = [];
    public walls: Block[][] = [
        [], //Top-Wall
        [], //Right-Wall
        [], //Bottom-Wall
        [] //Left-Wall
    ];
    public doors: Block[][] = [
        [], //Top-Wall Spaces
        [], //Right-Wall Spaces
        [], //Bottom-Wall Spaces
        [] //Left-Wall Spaces
    ];
    public internIndexMap: Array<Block>;
    public topLeftIndex: number;
    public outerSize: number;
    private skipLWall = false;
    private skipTWall = false;

    constructor(
        public map: GameMap,
        public innerTopLeftBIndex: number,
        public innerSize: number,
        public previousWalls: Block[][]) {

        this.internIndexMap = new Array(this.innerSize * this.innerSize);
        this.topLeftIndex = this.innerTopLeftBIndex - this.map.totalBlocksX - 1;
        this.outerSize = this.innerSize + 2;

        this.build();
    }

    build() {
        //Build up the Inner Room
        var index = this.innerTopLeftBIndex;
        var internIndex = 0;
        var nextRowIndex = this.innerTopLeftBIndex + this.map.totalBlocksX;
        for (let i = 0; i < this.innerSize; ++i) {
            for (let j = 0; j < this.innerSize; ++j) {
                this.internIndexMap[internIndex] = this.map.blocks[index];
                this.internIndexMap[internIndex].changeType(0);
                internIndex++;
                index++;
            }
            index = nextRowIndex;
            nextRowIndex += this.map.totalBlocksX;
        }


        //Copy Bottom Wall of Top Neighbour
        if (this.previousWalls[1].length > 1) {
            this.walls[0] = [];
            this.skipTWall = true;
            this.previousWalls[1].forEach(block => {
                this.walls[0].push(this.map.blocks[block.indexOnMap + this.map.totalBlocksX]);
                this.walls[0][this.walls[0].length - 1].changeType(block.type);
            });
        }

        //Copy Right Wall of Left Neighbour
        if (this.previousWalls[0].length > 1) {
            this.skipLWall = true;
            for (let i = 0; i < this.previousWalls[0].length; i++) {
                this.walls[3].push(this.map.blocks[this.map.blocks.indexOf(this.previousWalls[0][i]) + 1]);
                this.walls[3][i].changeType(this.previousWalls[0][i].type);
            }
        }



        //TODO: Build up Walls around the room
        //Top-Wall
        var wallIndexTop = this.innerTopLeftBIndex - this.map.totalBlocksX - 1;
        if (!this.skipTWall) {
            for (let i = 0; i <= this.innerSize + 1; i++) {
                this.walls[0].push(this.map.blocks[wallIndexTop]);
                wallIndexTop++;
            }

            for (let j = 1; j < this.innerSize + 2; j++) {
                this.walls[0][j].changeType(1);
            }



            this.walls[0][0].changeType(3);
            this.walls[0][this.outerSize - 1].changeType(3);
        }

        //Left-Wall
        var wallIndexLeft = this.innerTopLeftBIndex - this.map.totalBlocksX - 1;
        if (!this.skipLWall) {
            for (let i = 0; i <= this.innerSize + 1; i++) {
                this.walls[3].push(this.map.blocks[wallIndexLeft]);
                wallIndexLeft += this.map.totalBlocksX;
            }
            for (let j = 1; j <= this.innerSize + 1; j++) {
                this.walls[3][j].changeType(2);
            }

            this.walls[3][0].changeType(3);
            this.walls[3][this.innerSize + 1].changeType(3);
        }

        //Right- and Bottom-Wall
        var wallIndexRight = this.innerTopLeftBIndex - this.map.totalBlocksX + this.map.roomSize;
        var wallIndexBottom = this.innerTopLeftBIndex + this.map.totalBlocksX * (this.innerSize) - 1;
        for (let i = 0; i <= this.innerSize + 1; i++) {
            this.walls[1].push(this.map.blocks[wallIndexRight]);
            wallIndexRight += this.map.totalBlocksX;

            this.walls[2].push(this.map.blocks[wallIndexBottom]);
            wallIndexBottom++;
        }

        for (let j = 0; j <= this.innerSize + 1; j++) {
            this.walls[1][j].changeType(2);
            this.walls[2][j].changeType(1);
        }
        let x = getRandomIntInclusive(1, this.innerSize);
        this.walls[2][x].changeType(0);
        this.doors[2].push(this.walls[2][x]);

        x = getRandomIntInclusive(1, this.innerSize);
        this.walls[1][x].changeType(0);
        this.doors[1].push(this.walls[1][x]);

        this.walls[2][0].changeType(3);
        this.walls[1][this.innerSize + 1].changeType(3);

        this.walls[2][0].changeType(3);
        this.walls[2][this.innerSize + 1].changeType(3);
        this.walls[1][0].changeType(3);
        this.walls[1][this.innerSize + 1].changeType(3);

        this.walls[0].forEach(element => {
            this.blocks.push(element);
        });
        for (let j = 0; j < this.innerSize; j++) {
            this.blocks.push(this.walls[3][j + 1]);
            for (let i = 0; i < this.innerSize; i++) {
                this.blocks.push(this.internIndexMap[i + this.innerSize * j]);
            }
            this.blocks.push(this.walls[1][j + 1]);
        }
        this.walls[2].forEach(element => {
            this.blocks.push(element);
        });
    }

    moveBy(x: number, y: number) {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            let newIndex = this.blocks[i].indexOnMap + x + (y * this.map.totalBlocksX);
            this.map.blocks[newIndex].changeType(this.blocks[i].type);
            this.map.blocks[this.blocks[i].indexOnMap].changeType(4);
        }
        this.topLeftIndex += x + y * this.map.totalBlocksX;
        this.rebuild();
        this.buildCorridors();
    }

    buildCorridors() {
        if (this.doors[0].length > 0) {
            this.doors[0].forEach(block => {
                let index = this.map.blocks.indexOf(block);
                for (let i = 1; i < this.map.roomSpaceY + 1; i++) {
                    this.map.blocks[index - (i * this.map.totalBlocksX)].changeType(0);
                    this.map.blocks[index - (i * this.map.totalBlocksX) - 1].changeType(3);
                    this.map.blocks[index - (i * this.map.totalBlocksX) + 1].changeType(3);
                }
            });
        }

        if (this.doors[3].length > 0) {
            this.doors[3].forEach(block => {
                let index = this.map.blocks.indexOf(block);
                for (let i = 1; i < this.map.roomSpaceY + 1; i++) {
                    this.map.blocks[index - i].changeType(0);
                    this.map.blocks[index - i + this.map.totalBlocksX].changeType(1);
                    this.map.blocks[index - i - this.map.totalBlocksX].changeType(1);
                }
            });
        }
    }

    rebuild() {
        this.walls.forEach(wall => {
            wall.length = 0;
        });
        this.doors = [[], [], [], []];

        var wallIndexTop = this.topLeftIndex;
        for (let i = 0; i <= this.innerSize + 1; i++) {
            this.walls[0].push(this.map.blocks[wallIndexTop]);
            if (this.map.blocks[wallIndexTop].type == 0 && i > 0 && i < this.innerSize + 1) {
                this.doors[0].push(this.map.blocks[wallIndexTop]);
            }
            wallIndexTop++;
        }
        var wallIndexLeft = this.topLeftIndex;
        for (let i = 0; i <= this.innerSize + 1; i++) {
            this.walls[3].push(this.map.blocks[wallIndexLeft]);
            if (this.map.blocks[wallIndexLeft].type == 0 && i > 0 && i < this.innerSize + 1) {
                this.doors[3].push(this.map.blocks[wallIndexLeft]);
            }
            wallIndexLeft += this.map.totalBlocksX;
        }
        var wallIndexRight = this.topLeftIndex + this.innerSize + 1;
        var wallIndexBottom = this.topLeftIndex + ((this.innerSize + 1) * this.map.totalBlocksX);
        for (let i = 0; i <= this.innerSize + 1; i++) {
            this.walls[1].push(this.map.blocks[wallIndexRight]);
            if (this.map.blocks[wallIndexRight].type == 0 && i > 0 && i < this.innerSize + 1) {
                this.doors[1].push(this.map.blocks[wallIndexRight]);
            }
            wallIndexRight += this.map.totalBlocksX;

            this.walls[2].push(this.map.blocks[wallIndexBottom]);
            if (this.map.blocks[wallIndexBottom].type == 0 && i > 0 && i < this.innerSize + 1) {
                this.doors[2].push(this.map.blocks[wallIndexBottom]);
            }
            wallIndexBottom++;
        }
    }
}