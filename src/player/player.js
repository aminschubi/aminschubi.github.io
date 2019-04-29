class Player {
    constructor(texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = 50 * 6;
        this.sprite.y = 50 * 6;
        this.sprite.angle = 0;
        this.sprite.anchor.set(0.5)

        this.hp = 100;
        this.mana = 100;

        this.attackValue = 5;

        this.itemsInSight = [];
        this.interactableInSight = [];
        this.nearestItem;

        this.leftState;
        this.upState;
        this.rightState;
        this.downState;
        this.interactBState;

        this.interacting = false;

        this.interactionField = new PIXI.Sprite(loader.resources.testhitbox.texture);
        this.interactionField.anchor.set(0.5)
        this.interactionField.x = 0;
        this.interactionField.y = -this.sprite.texture.height;
        this.sprite.addChild(this.interactionField);
    }

    update(delta, keyboardInputs, itemsInBounds) {
        this.downState = keyboardInputs[0];
        this.upState = keyboardInputs[1];
        this.leftState = keyboardInputs[2];
        this.rightState = keyboardInputs[3];
        this.interactBState = keyboardInputs[4];

        console.log(keyboardInputs);
        console.log(this.interacting);

        if (this.downState && this.interacting === false) {
            this.sprite.y += 5 * 2;
            this.sprite.angle = 180;
        }
        if (this.upState && this.interacting === false) {
            this.sprite.y -= 5 * 2;
            this.sprite.angle = 0;
        }
        if (this.leftState && this.interacting === false) {
            this.sprite.x -= 5 * 2;
            this.sprite.angle = 270;
        }
        if (this.rightState && this.interacting === false) {
            this.sprite.x += 5 * 2;
            this.sprite.angle = 90;
        }
        if (this.interactBState && this.interacting === false && this.nearestItem != 0) {
            this.interact();
        }
        this.updateIF(itemsInBounds);
    }

    updateIF(itemsInBounds) {
        this.itemsInSight = itemsInBounds[0];
        this.interactableInSight = itemsInBounds[1];
        this.nearestItem = itemsInBounds[2];
        //console.log(this.nearestItem);
        if (this.nearestItem instanceof Item) {
            //console.log("X");
            this.nearestItem.interactRange = true;
        }
        //console.log(nearestItem);
    }

    interact() {
        this.interacting = true;
        this.nearestItem.interact();
        var i = this;
        let t = setTimeout(function () {
            i.interacting = false;
            console.log("Hello");
        }, 5000);
    }
}