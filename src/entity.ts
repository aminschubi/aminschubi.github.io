import { Component } from "./components/component";

export class Entity {
    constructor( private components = new Map<String, Component>()) {
    }

    addComponent(component: Component) {
        if (this.components.has(component.name)) {
            throw new Error(`Entity already has a '${component.name}'-component`);
        }
        this.components.set(component.name, component);
    }

    removeComponent(name: string) {
        if (!this.components.has(name)) {
            throw new Error(`Entity has no component '${name}'`);
        }
        return this.components.delete(name);
    }

    getComponent(name: String) {
        if(!this.components.has(name)){
            throw new Error(`Entity has no component '${name}'`);
        }
        return this.components.get(name);
    }

    print() {
        console.log(JSON.stringify(this, null, 4));
    }
}