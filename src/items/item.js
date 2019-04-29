class Item extends PIXI.Sprite {
    constructor(id, x, y) {
        super();
        this.properties = [];
        this.id = id;
        this.name = "";
        this.x = x;
        this.y = y;
        this.anchor.set(0.5);
        this.interactRange = false;

        this.interactSprite = new PIXI.Sprite(loader.resources.interact.texture);
        this.interactSprite.x = -this.interactSprite.width / 2;
        this.interactSprite.y -= this.interactSprite.height * 2 - 20;
        this.addChild(this.interactSprite);
        this.interactSprite.visible = false;

        this.setup(this.id);
    }

    setup(id) {
        switch (id) {
            case 0:
                this.id = 0;
                this.name = "Chest";
                this.properties = ["interact", "unpassable"];
                this.texture = loader.resources.item.texture;
                this.interact = function () {
                    console.log("interacted");
                };
        }
    }

    update(delta, itemsInPlayerSight) {
        let found;
        if (itemsInPlayerSight.length > 0) {
            found = itemsInPlayerSight.find(element => element === this);
            if (this.interactRange === true) {
                this.interactSprite.visible = true;
            }
        }
        if (found != this) {
            this.interactRange = false;
            this.interactSprite.visible = false;
        }
    }
}