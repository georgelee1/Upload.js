import {Cache} from "./cache"

/**
 * Simple util function that calls the callback for every element with the element as the
 * only parameter. Determines if the passed element type is an Array, DOMList or single element.
 *
 * @param ele The element(s)
 * @param callback The callback function
 */
function every(ele, callback) {
    let elements = []
    if (Array.isArray(ele)) {
        elements = ele
    } else if (Array.isArray(ele.items)) {
        elements = ele.items
    } else {
        elements.push(ele)
    }
    elements.forEach(callback)
}

/**
 * Returns a matcher function that tests if the DOM element is of the passed type
 *
 * @param type The element node type
 * @returns {Function} The matcher function
 */
export function type(type) {
    return ele => {
        return ele.tagName.toUpperCase() === type.toUpperCase()
    }
}

/**
 * Returns a matcher function that tests if the passed class name exists for the DOM element
 *
 * @param css The class name to check
 * @returns {Function} The matcher function
 */
export function css(css) {
    return ele => {
        return (ele.className || "").split(" ").indexOf(css) >= 0
    }
}

/**
 * Takes a single or list of matcher functions. Returns a function that takes an HTML DOM element and returns true if
 * all matchers return True for the passed element or any parent up to the root of that element.
 *
 * @see {@link css}
 * @see {@link type}
 * @param matchers Single or list of matcher functions
 * @returns {Function} The function to perform the checks
 */
export function matchesOrChild(...matchers) {
    return ele => {
        let current = ele
        while (current) {
            if (matchers.every(matcher => { return matcher(current) })) {
                return true
            }
            current = current.parentNode
        }
        return false
    }
}

/**
 * Takes a single or list of matcher functions. Returns a function that takes an HTML DOM element and returns true if
 * all matchers return True for the passed element.
 *
 * @see {@link css}
 * @see {@link type}
 * @param matchers Single or list of matcher functions
 * @returns {Function} The function to perform the checks
 */
export function matches(...matchers) {
    return ele => {
        return matchers.every(matcher => {
            return matcher(ele)
        })
    }
}

/**
 * Takes a single or list of matcher functions. Returns a function that takes an HTML DOM element and returns a list of
 * children elements that
 *
 * @see {@link css}
 * @see {@link type}
 * @param matchers Single or list of matcher functions
 * @returns {Function} The function to perform the checks
 */
export function children(...matchers) {
    return ele => {
        let matched = []
        every(ele, e => {
            let children = e.childNodes
            for (let x = 0, len = children.length; x < len; x++) {
                if (children[x].nodeType === 1 && matchers.every(matcher => matcher(children[x]))) {
                    matched.push(children[x])
                }
            }
        })
        return matched
    }
}

/**
 * Triggers the handler for any children of ele or ele itself it they match the matcher
 *
 * @param ele The HTML DOM element
 * @param event The event name, eg. click
 * @param matcher The matcher function, should return True if matches
 * @param handler The handler that is called for the event
 */
export function on(ele, event, matcher, handler) {
    every(ele, e => {
        e.addEventListener(event, event => {
            if (matcher(event.target)) {
                handler(event)
            }
        })
    })
}

/**
 * Returns a transformation function that adds the passed class name to the element passed to the subsequently called function
 *
 * Usage:
 * cls("test")(ele)
 * cls("test2", false)(ele)(ele2)
 *
 * @param {string} cls The class name to add
 * @param {boolean} add True to add or False to remove the class
 * @returns {Function} The class adding function
 */
export function cls(cls, add = true) {
    let func = elements => {
        every(elements, ele => {
            let classes = !!ele.className ? ele.className.split(" ") : [];
            if (add) {
                classes.push(cls)
            } else {
                let index = classes.indexOf(cls)
                if (index >= 0) {
                    classes.splice(index, 1)
                }
            }
            ele.className = classes.join(" ")
        })
        return func
    }
    return func
}

/**
 * Returns a transformation function that sets the passed attributes on to the elements passed to the subsequently called function
 *
 * Usage:
 * attr("test", "val")(ele) // add
 * attr("test", "val")(ele)(ele2) // add
 * attr({
 *  test: "val", // add
 *  test2: undefined // remove
 * )(ele) 
 * attr("test")(ele) // remove
 */
export function attr(key, val) {
    let func = elements => {
        every(elements, ele => {
            if (typeof key === "object") {
                Object.keys(key).forEach(k => {
                    if (typeof key[k] === "undefined") {
                        ele.removeAttribute(k)
                    } else {
                        ele.setAttribute(k, key[k])
                    }
                })
            } else {
                if (typeof val === "undefined") {
                    ele.removeAttribute(key)
                } else {
                    ele.setAttribute(key, val)
                }
            }
        })
        return func
    }
    return func
}

/**
 * The purpose of the SimpleDOMParser is to parse an expressive HTML string into DOM elements. The style of the expressive HTML string
 * is simple on purpose with only the element tag name and class names definable. Hierarchy is expressed using parenthesis.
 *
 * The SimpleDOMParser uses a cache to provide a level of performance for repeated calls. By default the size of the cache
 * is limited to 10. DOM elements are memory expensive, increasing the size of the cache should be done with caution. The cache will
 * evict entries based on when they were last accessed, evicting the oldest first.
 *
 * Examples:
 * let parser = new SimpleDOMParser()
 *
 * let result = parser.parse("div")
 * result.outerHTML == '<div></div>'
 *
 * result = parser.parse("div.myclass")
 * result.outerHTML == '<div class="myclass"></div>'
 *
 * result = parser.parse("div.myclass.another")
 * result.outerHTML == '<div class="myclass another"></div>'
 *
 * result = parser.parse("div div.sibling")
 * result.outerHTML == '<div></div><div class="sibling"></div>'
 *
 * result = parser.parse("div (div.child)")
 * result.outerHTML == '<div><div class="child"></div></div>'
 *
 * result = parser.parse("div (div.child div.child.sibling) div.sibling")
 * result.outerHTML == '<div><div class="child"></div><div class="child sibling"></div></div><div class="sibling"></div>'
 *
 * result = parser.parse("div (div.child (div.nested))")
 * result.outerHTML == '<div><div class="child"><div class="nested"></div></div></div>'
 *
 * @class
 */
export class SimpleDOMParser {
    constructor(size = 10) {
        this._cache = new Cache(size)
    }

    /**
     * Perform the actual parse of the value, see class level doc for more info.
     */
    parse(val) {
        let nodes = this._cache.get(val)
        if (!nodes) {
            nodes = new DOMList(this._build(val))
            this._cache.put(val, nodes)
        }
        return nodes.clone()
    }

    _build(val) {
        let nodes = [], node = false, hierarchy = []

        val.split(/(\s*[ \s\(\)]\s*)/).forEach(t => {
            let token = t.trim()
            if (token.length === 0) {
                return
            }
            if (token === ")") {
                let back = hierarchy.pop()
                if (!back) {
                    throw "ExpressiveDOMParser: Invalid location for closing parenthesis"
                }
                node = back.node
                nodes.forEach(e => node.appendChild(e))
                nodes = back.nodes
            } else if (token === "(") {
                if (!node) {
                    throw "ExpressiveDOMParser: Invalid location for opening parenthesis"
                }
                hierarchy.push({
                    "node": node,
                    "nodes": nodes
                })
                nodes = []
            } else {
                let parts = token.split("\."), name = parts.shift()
                node = document.createElement(name)
                if (parts.length) {
                    node.className = parts.join(" ")
                }
                nodes.push(node)
            }
        })

        if (hierarchy.length) {
            throw "ExpressiveDOMParser: Unmatched opening and closing parenthesis"
        }

        return nodes
    }
}

/**
 * The DOM List is a wrapper around a list of DOM elements that allow easy modification of the wrapped DOM elements.
 *
 * Usage:
 * let list = new DOMList([dom1, dom2])
 * list.apply(cls("test"), attr("test", "val")).appendTo(parent) // functions can be chained
 * list.items // access to array of elements
 * list.clone() // returns a list of deep cloned node
 *
 * @class
 */
export class DOMList {
    constructor(doms = []) {
        this.items = doms
    }

    /**
     * Returns a new DOMList with all wrapped elements cloned deeply
     */
    clone() {
        let cloned = []
        this.items.forEach(ele => {
            cloned.push(ele.cloneNode(true))
        })
        return new DOMList(cloned)
    }

    /**
     * Apply the passed transformation functions to the DOM elements within this DOMList
     *
     * @param {function} actions Single or list of transformation functions such as #css, #attr
     */
    apply(...actions) {
        actions.forEach(action => {
            this.items.forEach(ele => {
                action(ele)
            })
        })
        return this
    }

    /**
     * Append the DOM elements within this DOMList to the passed parent DOM element
     *
     * @param parent The parent DOM element to append to
     */
    appendTo(parent) {
        let p = parent
        if (Array.isArray(p)) {
            p = parent[0]
        }
        this.items.forEach(ele => {
            p.appendChild(ele)
        })
        return this
    }
}