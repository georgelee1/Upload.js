/**
 * In the demo we are mocking the HTTP calls because we don't actually want to upload any of the files and over burden some poor server somewhere.
 */
function DemoHttp(url, params) {
    this._p = 0;
    this._interval = setInterval(this.step.bind(this), 20);
};
DemoHttp.prototype.step = function step() {
    this._p++;
    if (this._progress) {
        this._progress.forEach(function(callback) {
            callback(this._p);
        }, this);
    }
    if (this._p === 100) {
        if (this._done) {
            this._done.forEach(function(callback) {
                callback({success:true, uploadImageId: 1});
            });
        }
        clearInterval(this._interval);
    }
};
DemoHttp.prototype.progress = function progress(callback) {
    if (!this._progress) {
        this._progress = [];
    }
    this._progress.push(callback);
    return this;
};
DemoHttp.prototype.done = function done(callback) {
    if (!this._done) {
        this._done = [];
    }
    this._done.push(callback);
    return this;
};
DemoHttp.prototype.fail = function fail(callback) {
    return this;
};
function http() {
    return function(url, params) {
        return new DemoHttp(url, params);
    }
}
function log(u) {
    u.on("upload.added upload.started upload.progress upload.done upload.fail delete.added delete.started delete.done delete.fail", function(e) {
        console.info(e.type)
    });
}

// Demo 1
new UploadJs(document.getElementById("upload-demo-1"), {"http": http})