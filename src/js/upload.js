import {Widget} from "./ui/widget"

/**
 * Default options for the UploadJs widget
 */
const DEFAULTS = {
    // template Strings
    "template": {
        "item": "div.item (img)",
        "add": "div.item.new (div.icon.plus)",
        "actions": "div.actions (div.action.bin (div.trash))",
        "deleting": "div.spinner div.icon.upload",
        "uploading": "div.spinner div.icon.trash div.progress",
        "done": "div.icon.done (i)",
        "error": "div.icon.error (i)"
    },
    "max": 0,
    "deletable": true,
    "url": {
        "upload": "...",
        "delete": "..."
    },
    "types": {
        "images": ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    },
    "allowed_types": ["images"]
}

/**
 * Allows plain vanilla JavaScript access to the UploadJs Widget.
 *
 * Usage:
 * var ele = document.getElementById("myid");
 * var options = { ... }
 * new UploadJs(ele, options)
 *
 * @constructor
 */
window.UploadJs = class UploadJs {

    /**
     * @param ele The
     * @param {object} opts - Optional. The widget settings.
     */
    constructor(ele, opts={}) {
        new Widget(ele, merge(DEFAULTS, opts))
    }
}

/**
 * Simple object merging utility. Runs deep. Returns a new object, no modifications
 * are made to the original target and source.
 *
 * @param target The target object
 * @param source The source object
 * @returns {{}} The new instance of the merged objects
 */
function merge(target, source) {
    var clone = {}
    Object.keys(target).forEach(k => {
        if (typeof target[k] === "object") {
            clone[k] = merge({}, target[k])
        } else {
            clone[k] = target[k]
        }
    })
    Object.keys(source).forEach(k => {
        if (k in clone && typeof clone[k] === "object" && typeof source[k] === "object") {
            clone[k] = merge(clone[k], source[k])
        } else {
            clone[k] = source[k]
        }
    })
    return clone
}