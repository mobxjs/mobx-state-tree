import {action} from "mobx"
import {extend} from "../utils"
import {getNode, hasNode} from "./node"

export type ModelFactory = {
    (snapshot?: any, env?: Object): any
    isModelFactory: true
    factoryName: string
}

export function createFactoryHelper(name: string, factory: Function): ModelFactory {
    return extend(
        action(name, factory) as any,
        {
            isModelFactory: true,
            factoryName: name
        }
    )
}

export function isModelFactory(value: any): value is ModelFactory {
    return typeof value === "function" && value.isModelFactory === true
}

export function getModelFactory(object: Object): ModelFactory {
    return getNode(object).factory
}

export function getChildModelFactory(object: Object, child: string): ModelFactory {
    return getNode(object).getChildFactory(child)
}

export function isModel(model: any): boolean {
    return hasNode(model)
}
