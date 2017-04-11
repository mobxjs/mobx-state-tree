import { observable } from "mobx"
import { Property } from "./property"
import { getMSTAdministration, valueToSnapshot, escapeJsonPath } from "../../core"
import { addHiddenWritableProp } from "../../utils"

export class TransformedProperty extends Property {
    constructor(propertyName: string, public setter: Function, public getter: Function) {
        super(propertyName)
    }

    initialize(targetInstance: any, snapshot: any) {
        const box = observable.shallowBox(snapshot[this.name], targetInstance.constructor.name + "." + this.name)
        addHiddenWritableProp(targetInstance, this.name + "$value", box)
        const self = this
        Object.defineProperty(targetInstance, this.name, {
            get: function() {
                getMSTAdministration(this).assertAlive() // Expensive for each read, so optimize away in prod builds!
                return self.getter.call(this, box.get())
            },
            set: function(v) {
                const node = getMSTAdministration(this)
                node.assertWritable()
                if (this[self.name] === v)
                    return
                const newValue = self.setter.call(this, v)
                box.set(newValue)
                node.emitPatch({
                    op: "replace",
                    path: escapeJsonPath(self.name),
                    value: valueToSnapshot(newValue)
                }, node)
            }
        })
        targetInstance[this.name] = snapshot[this.name]
    }

    serialize(instance: any, snapshot: any) {
        snapshot[this.name] = valueToSnapshot(instance[this.name + "$value"].get())
    }

    deserialize(instance: any, snapshot: any) {
        instance[this.name + "$value"].set(snapshot[this.name])
    }

    isValidSnapshot(snapshot: any) {
        // TODO: is a better check possible?
        return this.name in snapshot
    }
}
