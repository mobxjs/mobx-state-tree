import {action} from "mobx"
import {fail, extend} from "../utils"
import {getNode} from "./node"

export type ModelFactory = { (snapshot?: any, env?: Object): any; isModelFactory: true }

export function createFactoryHelper(name: string, factory: Function): ModelFactory {
    return extend(action(name, factory), { isModelFactory: true })
}

export function isModelFactory(value: any): value is ModelFactory {
    return typeof value === "function" && value.isModelFactory === true
}

export function composeFactory(...models: (ModelFactory | any)[]): ModelFactory {
    // TODO: implement
    return fail("not implemented yet")
}

export function getModelFactory(object: Object): ModelFactory {
    return getNode(object).factory
}

export function getChildModelFactory(object: Object, child: string): ModelFactory {
    return getNode(object).getChildFactory(child)
}
