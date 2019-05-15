import { Component } from "../components/component";

export abstract class System<C extends Component> {
    private components: C[] = [];

    addComponent(component: C){
        this.components.push(component);
        component.entity.addComponent(component);
    }

    update(delta: number, doForEach = (component: C) => component.update(delta)): void  {
        this.components.forEach(doForEach);
    }
}