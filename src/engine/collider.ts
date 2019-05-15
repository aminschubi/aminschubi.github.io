export function hitTestRectangle(r1: PIXI.Sprite, r2: PIXI.Sprite) {

    //Define the variables we'll need to calculate
    let hit: boolean, combinedHalfWidths: number, combinedHalfHeights: number, vx: number, vy: number;
    let r1centerX: number, r1centerY: number, r1halfHeight: number, r1halfWidth: number;
    let r2centerX: number, r2centerY: number, r2halfHeight: number, r2halfWidth: number;
    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1centerX = r1.anchor.x == 0.5 ? r1.x : r1.x + r1.width / 2;
     r1centerY = r1.anchor.y == 0.5 ? r1.y : r1.y + r1.height / 2;
    r2centerX = r2.anchor.x == 0.5 ? r2.x : r2.x + r2.width / 2;
     r2centerY = r2.anchor.y == 0.5 ? r2.y : r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1halfWidth = r1.width / 2;
    r1halfHeight = r1.height / 2;
    r2halfWidth = r2.width / 2;
    r2halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1centerX - r2centerX;
    vy = r1centerY - r2centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1halfWidth + r2halfWidth;
    combinedHalfHeights = r1halfHeight + r2halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};