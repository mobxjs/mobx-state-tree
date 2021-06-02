---
id: inheritance
sidebar_label: Simulating inheritance
title: Simulate inheritance by using type composition
---

<div id="codefund"></div>

There is no notion of inheritance in MST. The recommended approach is to keep references to the original configuration of a model in order to compose it into a new one, for example by using `types.compose` (which combines two types) or producing fresh types using `.props|.views|.actions`. An example of classical inheritance could be expressed using composition as follows:

```javascript
const Square = types
    .model(
        "Square",
        {
            width: types.number
        }
    )
    .views(self => ({
        // note: this is not a getter! this is just a function that is evaluated
        surface() {
            return self.width * self.width
        }
    }))

// create a new type, based on Square
const Box = Square
    .named("Box")
    .views(self => {
        // save the base implementation of surface, again, this is a function.
        // if it was a getter, the getter would be evaluated only once here
        // instead of being able to evaluate dynamically at time-of-use
        const superSurface = self.surface

        return {
            // super contrived override example!
            surface() {
                return superSurface() * 1
            },
            volume() {
                return self.surface() * self.width
            }
        }
    }))

// no inheritance, but, union types and code reuse
const Shape = types.union(Box, Square)

const instance = Shape.create({type:"Box",width:4})
console.log(instance.width)
console.log(instance.surface()) // calls Box.surface()
console.log(instance.volume()) // calls Box.volume()
```

Similarly, compose can be used to simply mix in types:

```javascript
const CreationLogger = types.model().actions((self) => ({
    afterCreate() {
        console.log("Instantiated " + getType(self).name)
    }
}))

const BaseSquare = types
    .model({
        width: types.number
    })
    .views((self) => ({
        surface() {
            return self.width * self.width
        }
    }))

export const LoggingSquare = types
    .compose(
        // combine a simple square model...
        BaseSquare,
        // ... with the logger type
        CreationLogger
    )
    // ..and give it a nice name
    .named("LoggingSquare")
```
