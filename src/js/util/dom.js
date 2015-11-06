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
        return (e.className || "").split(" ").indexOf(c)
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
            let result = children[x].nodeType === 1 && matchers.every(m => {
                return m(children[x])
            })
            if (result) {
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