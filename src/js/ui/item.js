/**
 * The Item class provides common login between Uploading and Deletion
 */
export class Item {
    constructor(ele, listeners={}) {
        this._ele = ele
        this._listeners = listeners
    }
    
    /**
     * Triggers the registered events with the passed arguments
     */
    _trigger(event) {
        if (this._listeners && Array.isArray(this._listeners[event.type])) {
            this._listeners[event.type].forEach(listener => {
                if (typeof listener === "function") {
                    listener.call(this._ele.items ? this._ele.items[0] : this._ele, event)
                }
            })
        }
    }
}