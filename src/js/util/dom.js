import {Cache} from "./cache"

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
 * Flattens the passed object into an Array of elements. Detect if the type is a single element, an Array or a DOMList.
 */
function flat(ele) {
    let elements = []
    if (Array.isArray(ele)) {
        elements = ele
    } else if (Array.isArray(ele.items)) {
        elements = ele.items
    } else {
        elements.push(ele)
    }
    return elements
}

/**
 * The DOM List is a wrapper around a list of DOM elements that allow easy modification of the wrapped DOM elements.
 *
 * Usage:
 * let list = new DOMList([dom1, dom2])
 * list.items // access to array of elements
 *
 * @class
 */
export class DOMList {
    constructor(doms = []) {
        if (typeof doms === "string") {
            this.items = [document.createElement(doms)]
        } else if (Array.isArray(doms)) {
            this.items = doms
        } else {
            this.items = []
            if (doms) {
                this.items.push(doms)
            }
        }
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
     * Append the DOM elements within this DOMList to the passed parent DOM element
     *
     * @param parent The parent DOM element to append to
     */
    appendTo(parent) {
        flat(parent).forEach(p => {
            this.items.forEach(ele => {
                p.appendChild(ele)
            })
        })
        return this
    }
    
    /**
     * Inserts the DOM elements within the DOMList before the passed parent DOM element
     * 
     * @param parent The parent DOM element to insert before
     */
    before(insertBefore) {
        flat(insertBefore).forEach(b => {
            this.items.forEach(ele => {
                b.parentNode.insertBefore(ele, b)
            })
        })
        return this
    }
    
    /**
     * Removes the DOM elements within this DOMList from the document tree
     */
    remove() {
        this.items.forEach(ele => {
            ele.parentNode.removeChild(ele)
        })
        return this
    }
    
    /**
     * Traverses up the document tree to find the parent the first parent of the DOM elements within this DOMList.
     * If matcher is not supplied will return the parent of the first DOM element in this DOMList.
     */
    parent(matcher) {
        let result = undefined
        if (matcher instanceof Matcher) {
            this.items.some(ele => {
                let parent = ele.parentNode
                while (parent) {
                    if (matcher.test(parent)) {
                        result = parent
                        return true
                    }
                    parent = parent.parentNode
                }
            })
        } else {
            this.items.some(ele => {
                if (ele.parentNode) {
                    result = ele.parentNode
                    return true
                }
            })
        }
        return new DOMList(result)
    }
    
    /**
     * Add the passed style class to all the DOM elements within this DOMList
     * 
     * @param cls The class(s) name to add
     */
    addClass(...cls) {
        this.items.forEach(ele => {
            let classes = !!ele.className ? ele.className.split(" ") : [];
            cls.forEach(c => {
                if (classes.indexOf(c) < 0) {
                    classes.push(c)
                }
            })
            ele.className = classes.join(" ")
        })
        return this
    }
    
    /**
     * Add the passed style class to all the DOM elements within this DOMList
     * 
     * @param cls The class(s) name to add
     */
    removeClass(...cls) {
        this.items.forEach(ele => {
            let classes = !!ele.className ? ele.className.split(" ") : [];
            cls.forEach(c => {
                let index = classes.indexOf(c)
                if (index >= 0) {
                    classes.splice(index, 1)
                }
            })
            ele.className = classes.join(" ")
        })
        return this
    }
    
    /**
     * Sets the passed css key and value on the DOM elements within this DOMList
     * 
     * Usage:
     * let list = new DOMList([dom1, dom2])
     * list.css("display", "none")
     * list.css({
     *    "display": "none",
     *    "width": "100%"
     * })
     */
    css(key, val) {
        this.items.forEach(ele => {
            if (typeof key === "object") {
                Object.keys(key).forEach(k => {
                    ele.style[k] = key[k]
                })
            } else {
                ele.style[key] = val
            }
        })
        return this
    }

    /**
    * Get or set the passed attribute on all the DOM elements within this DOMList.
    *
    * Usage:
    * let list = new DOMList([dom1, dom2])
    * list.attr("test", "val") // set
    * list.attr("test") === "val" // get
    * list.attr({
    *  test: "val", // set
    *  test2: undefined // remove
    * ) 
    * list.attr("test", undefined) // remove
    */
    attr(key, val) {
        if (typeof key === "object") {
            this.items.forEach(ele => {
                Object.keys(key).forEach(k => {
                    if (typeof key[k] === "undefined") {
                        ele.removeAttribute(k)
                    } else {
                        ele.setAttribute(k, key[k])
                    }
                })
            })
        } else if (typeof val === "undefined") {
            let result = undefined
            this.items.some(ele => {
                let attr = ele.getAttribute(key)
                if (typeof attr !== "undefined") {
                    result = attr
                    return true
                }
            })
            return result
        } else {
            this.items.forEach(ele => ele.setAttribute(key, val))
        }
        return this
    }
    
    /**
     * Get or set the passed data attributes on all the DOM elements within this DOMList.
     *
     * Usage:
     * let list = new DOMList([dom1, dom2])
     * list.data("test", "val") // set
     * list.data("test") === "val" // get
     * list.data({test: "val"}) // set
     * list.data({"test": undefined}) // remove 
     */
     data(key, val) {
         if (typeof key === "object") {
             this.items.forEach(ele => {
                 Object.keys(key).forEach(k => {
                     if (typeof key[k] === "undefined") {
                         delete ele.dataset[k]
                     } else {
                         ele.dataset[k] = key[k]
                     }
                 })
             })
         } else if (typeof val === "undefined") {
             let result = undefined
             this.items.some(ele => {
                 let data = ele.dataset[key]
                 if (typeof data !== "undefined") {
                     result = data
                     return true
                 }
             })
             return result
         } else {
             this.items.forEach(ele => ele.dataset[key] = val);
         }
         return this
     }
     
    /**
     * Registers the event lister on all the DOM elements within the DOMList
     *
     * @param event The event name, eg. click
     * @param matcher The matcher to filter events
     * @param handler The handler that is called for the event
     */
    on(event, matcher, handler) {
        this.items.forEach(ele => {
            ele.addEventListener(event, event => {
                if (matcher instanceof Matcher) {
                    if (matcher.test(event.target)) {
                        handler(event)
                    }
                } else {
                    matcher(event)
                }
            })
        })
        return this
    }
    
    /**
     * Uses the <ele>.querySelectorAll(..) to find the appropriate nodes from all the DOM elements within this DOMList and returns
     * them in a wrapped DOMList
     */
    find(selector) {
        let found = []
        this.items.forEach(ele => {
            let result = ele.querySelectorAll(selector)
            for (let x = 0, len = result.length; x < len; x++) {
                found.push(result[x])
            }
        })
        return new DOMList(found)
    }
    
    /**
     * Calls each of the passed handlers for each of the DOM elements within this DOMList with the DOM element as the only parameter
     */
    each(...handlers) {
        handlers.forEach(handler => {
            this.items.forEach(ele => {
                handler(ele)
            })
        })
        return this
    }
}

const MATCHERS = {
        type(type, ele) {
            return ele.tagName.toUpperCase() === type.toUpperCase()
        },
        css(css, ele) {
            let classes = (ele.className || "").split(" ")
            return css.every(c => { return classes.indexOf(c) >= 0 })
        }
}

/**
 * The Matcher tests whether a set of elements all match
 */
export class Matcher {
    constructor(bubble=false) {
        this._bubble = bubble
        this._matchers = []
    }
    
    /**
     * The testing element must match the type of the element
     */
    type(type) {
        this._matchers.push(MATCHERS.type.bind(this, type))
        return this
    }
    
    /**
     * Test testing element must contain all the css classes
     */
    css(...css) {
        this._matchers.push(MATCHERS.css.bind(this, css))
        return this
    }
    
    /**
     * Returns true if the passed element(s) match all the matchers configured
     */
    test(ele) {
        return flat(ele).every(e => {
            let next = e, result = false
            while (next && next.parentNode !== next) {
                result = this._matchers.every(m => m(next))
                if (!result) {
                    if (this._bubble) {
                        next = next.parentNode
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }
            return false
        }, this)
    }
}