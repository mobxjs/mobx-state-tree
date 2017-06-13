import route from "path-match"

export default function createRouter(routes) {
    const matchers = Object.keys(routes).map(path => [route()(path), routes[path]])
    return function(path) {
        return matchers.some(([matcher, f]) => {
            const result = matcher(path)
            if (result === false) return false
            f(result)
            return true
        })
    }
}
