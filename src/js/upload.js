import {Widget} from "./ui/widget"
import {Http} from "./util/http"

/**
 * Default options for the UploadJs widget
 */
const DEFAULTS = {
    // template Strings
    "template": {
        "item": "div.item (img)",
        "add": "div.item.new (div.icon.plus)",
        "actions": "div.actions (div.action.del (div.trash))",
        "deleting": "div.spinner div.icon.trash",
        "uploading": "div.spinner div.icon.upload div.progress",
        "done": "div.icon.done (i)",
        "error": "div.icon.error (i)"
    },
    "max": 0,
    "deletable": true,
    "types": {
        "images": ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    },
    "allowed_types": ["images"],
    "upload": {
        "url": function() {
            return this.dataset.uploadUrl
        },
        "param": function() {
            return this.dataset.uploadParam || "file"
        }
    },
    "delete": {
        "url": function() {
            return this.dataset.deleteUrl
        },
        "param": function() {
            return this.dataset.deleteParam || "file"
        }
    },
    "http": function() {
        return url, params => {
            return new Http(url, params)
        }
    }
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
     * @param ele The DOM element
     * @param {object} opts - Optional. The widget settings.
     */
    constructor(ele, opts={}) {
        let o = clone(DEFAULTS)
        merge(o, clone(opts))
        this._widget = new Widget(ele, o)
    }
    
    /**
     * Register an event listener with UploadJs
     * 
     * @param event Event name, can be `upload.added`, `upload.`started`, `upload.progress`, `upload.done`, `upload.failed`, `delete.added`, `delete.started`, `delete.done`, `delete.fail`
     */
    on(event, handler) {
        event.split(" ").forEach(e => {
            this._widget._addListener(e, handler)
        })
    }
}

/**
 * Simple object merging utility. Runs deep. Merges the source into to the target
 *
 * @param target The target object
 * @param source The source object
 */
function merge(target, source) {
    Object.keys(source).forEach(k => {
        if (k in target && typeof target[k] === "object" && typeof source[k] === "object") {
            target[k] = merge(target[k], source[k])
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
function clone(ele) {
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