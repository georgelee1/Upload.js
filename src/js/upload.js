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
    "max": function() {
        return parseInt(this.dataset.uploadMax) || 0
    },
    "deletable": function() {
        return this.dataset.uploadDeletable !== "false"
    },
    "types": {
        "images": ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    },
    "allowed_types": function() {
        if (typeof this.dataset.uploadAllowedTypes === "undefined") {
            return ["images"]
        }
        return this.dataset.uploadAllowedTypes.split(",")
    },
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
            return this.dataset.uploadDeleteUrl
        },
        "param": function() {
            return this.dataset.uploadDeleteParam || "file"
        }
    },
    "http": function() {
        return (url, params) => {
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
        this._widget = new Widget(ele, opts, DEFAULTS)
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
        return this
    }
}