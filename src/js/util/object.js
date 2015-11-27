/**
 * Simple object merging utility. Runs deep. Merges the source into to the target
 *
 * @param target The target object
 * @param source The source object
 */
export function merge(target, source) {
    Object.keys(source).forEach(k => {
        if (k in target && typeof target[k] === "object" && typeof source[k] === "object") {
            merge(target[k], source[k])
        } else {
            target[k] = source[k]
        }
    })
}

/**
 * Simple deep object cloner
 * 
 * @param ele The object, array, string, etc to clone
 */
export function clone(ele) {
    if (Array.isArray(ele)) {
        let c = []
        ele.forEach(e => {
            c.push(clone(e))
        })
        return c
    } else if (typeof ele === "object") {
        let c = {}
        Object.keys(ele).forEach(key => {
            c[key] = clone(ele[key])
        })
        return c
    } else {
        return ele
    }
}