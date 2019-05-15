import { DrawComponent } from "../components/draw-component";
import { System } from "./system";

export class DrawSystem extends System<DrawComponent>{
    public static systemName = 'draw-system';

    constructor(private viewport: Viewport) {
        super()
    }

    update(delta: number){
        super.update(delta, component => component.draw(this.viewport));
    }
}