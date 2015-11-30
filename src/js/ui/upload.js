import {Item} from "./item"
import {Update} from "../util/update"

/**
 * UploadItem handles the uploading of a file and the updating of the DOM elements
 */
export class UploadItem extends Item {
    constructor(ele, file, widget, listeners) {
        super(ele, listeners)
        this._file = file
        this._widget = widget
        this._fin = false
        this._up = new Update(this._update.bind(this), 200)
        
        this._trigger({type: "upload.added", file: this._file})
    }
    
    /**
     * Starts the uploading
     */
    run(done) {
        this._trigger({type: "upload.started", file: this._file})
        this._dom_progress = this._ele.find(".progress")
        
        let item = this
        this._widget._opts.get("upload.url", "upload.param", (url, param) => {
            item._widget._opts.get("http")(url, {[param]: item._file})
                .progress(item._progress.bind(item))
                .done(item._done.bind(item, done))
                .fail(item._fail.bind(item, done))
        })
    }
    
    /**
     * Triggered by the HTTP with updates on the progress of the upload
     * 
     * @private
     */
    _progress(percent) {
        if (!this._fin) {
            this._up.value = percent
            this._trigger({type: "upload.progress", file: this._file, progress: percent})
        }
    }
    
    /**
     * Called by the Update to apply the progress percent
     * 
     * @private
     */
    _update(percent) {
        if (!this._fin) {
            let val = 0 - (100 - percent)
            this._dom_progress.css("transform", `translateX(${val}%)`)
        }
    }
    
    /**
     * Triggered by the HTTP when the upload has successfully completed
     * 
     * @private
     */
    _done(done, data) {
        if (!data.success) {
            this._fail(done)
            return
        }
        
        this._update(200)
        this._fin = true
        this._ele.removeClass("uploading")
        let complete = this._widget._parser.parse(this._widget._opts.get("template.done")).appendTo(this._ele)
        
        let id = data["upload-image-id"] || data["uploadImageId"]
        if (typeof id !== "undefined") {
            this._ele.data("uploadImageId", id)
            if (this._widget._opts.get("deletable") !== false) {
                this._widget._parser.parse(this._widget._opts.get("template.actions")).appendTo(this._ele)
            } else {
                this._ele.addClass("static")
            }
        }
        
        setTimeout(() => {
            complete.addClass("going")
            setTimeout(() => {
                complete.remove()
            }, 3000)
        }, 2000)
        
        this._trigger({type: "upload.done", file: this._file, id})
        done()
    }
    
    /**
     * Triggered by the HTTP when the upload has failed
     * 
     * @private
     */
    _fail(done) {
        this._update(0)
        this._fin = true
        this._ele.addClass("stopped")
        this._widget._parser.parse(this._widget._opts.get("template.error")).appendTo(this._ele)
        
        setTimeout(() => {
            this._ele.addClass("removed")
            setTimeout(() => {
                this._ele.remove()
            }, 1000)
        }, 10000)
        
        this._trigger({type: "upload.failed", file: this._file})
        done()
    }
}