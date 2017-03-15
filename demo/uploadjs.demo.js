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
        callback({ success: true, uploadImageId: 1 });
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

// Demos
var index = 1;
var skip = [7];
while (true) {
  if (skip.indexOf(index) >= 0) {
    index++;
    continue;
  }
  var ele = document.getElementById("upload-demo-" + index);
  if (!ele) {
    break;
  }
  new UploadJs(ele, location.host.startsWith('localhost') ? {} : { "http": http });
  index++;
}

new UploadJs(document.getElementById("upload-demo-7"), { "http": http }).on("upload.progress", function(e) {
  $(this).find(".progress").removeClass("p0 p10 p20 p30 p40 p50 p60 p70 p80 p90 p100").addClass("p" + (Math.floor(e.progress / 10) * 10));
}).on("upload.done upload.failed", function() {
  $(this).find(".progress").addClass("done");
})

function lineSeparator() {
  var div, ta, text;

  div = document.createElement("div");
  div.innerHTML = "<textarea>one\ntwo</textarea>";
  ta = div.firstChild;
  text = ta.value;
  return text.indexOf("\r") >= 0 ? "\r\n" : "\n";
}

new Clipboard('.copy', {
  text: function(trigger) {
    var lines = [];
    $(trigger).siblings(".prettyprint").find("li").each(function(x, li) {
      lines.push($(li).find("span").text());
    });
    return lines.join(lineSeparator());
  }
});
