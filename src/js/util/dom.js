import {Cache} from "./cache"

/**
 * Returns a matcher function that tests if the DOM element is of the passed type
 *
 * @param type The element node type
 * @returns {Function} The matcher function
 */
export function type(type) {
    return e => {
        return e.tagName.toUpperCase() === type.toUpperCase()
    }
}

/**
 * Returns a matcher function that tests if the passed class name exists for the DOM element
 *
 * @param css The class name to check
 * @returns {Function} The matcher function
 */
export function css(css) {
    return e => {
        return (e.className || "").split(" ").indexOf(css) >= 0
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
    return e => {
        return matchers.every(m => {
            return m(e)
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
    return e => {
        let children = e.childNodes, matched = []
        for (let x = 0, len = children.length; x < len; x++) {
            if (children[x].nodeType === 1 && matchers.every(m => m(children[x]))) {
                matched.push(children[x])
            }
        }
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
    ele.addEventListener(event, e => {
        if (matcher(e.target)) {
            handler(e)
        }
    })
}

/**
 * Returns a function that adds the passed class name to the element passed to the subsequently called function
 *
 * Usage:
 * addClass("test")(ele)
 * addClass("test2")(ele)(ele2)
 *
 * @param cls The class name to add
 * @returns {Function} The class adding function
 */
export function addClass(cls) {
    let f = e => {
        let classes = !!e.className ? e.className.split(" ") : [];
        classes.push(cls)
        e.className = classes.join(" ")
        return f
    }
    return f
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
            nodes = this._build(val)
            this._cache.put(val, nodes)
        }
        let result = []
        nodes.forEach(node => {
            result.push(node.cloneNode(true))
        })
        return result
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