const NOOP = () => {};

/**
 * Simple AJAX Http caller that expects JSON response. Handles standard parameter posting and
 * file uploading.
 *
 * Usage (POST parameters):
 * let params = {
 *     key: "value"
 * }
 * let h = http("/post", params).done(data => {
 *     // do something with data
 * }).fail(() => {
 *     // do something when failed
 * })
 *
 * Usage (file uplaod):
 * let file = ...
 * let params = {
 *     file1: file
 * }
 * let h = http("/upload", params).progress((p => {
 *     // upload progress bar, p = percentage done
 * }).done(data => {
 *     // do something with data
 * }).fail(() => {
 *     // do something when failed
 * })
 */
export default function http(url, params = {}, headers = {}) {
  let _progress = NOOP;
  let _done = NOOP;
  let _fail = NOOP;
  const _instance = {};

  /**
   * Sets a progress handler for http request. Is called multiple times, periodically with a
   * progress value between 0 and 100
   */
  function progress(handler) {
    if (typeof handler === 'function') {
      _progress = handler;
    }
    return _instance;
  }

  /**
   * Sets a done handler for when the http request is complete. Called when response returns
   * with successful status code (2xx). Passed the parsed JSON object from the response.
   */
  function done(handler) {
    if (typeof handler === 'function') {
      _done = handler;
    }
    return _instance;
  }

  /**
   * Sets a failure handler for when the request fails with a non success http status code (2xx).
   */
  function fail(handler) {
    if (typeof handler === 'function') {
      _fail = handler;
    }
    return _instance;
  }

  /**
   * @private
   */
  function _post() {
    const data = new FormData();
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (Array.isArray(val)) {
        val.forEach(v => {
          if (v.type && v.name) {
            data.append(key, v, v.name);
          } else {
            data.append(key, v);
          }
        });
      } else {
        if (val.type && val.name) {
          data.append(key, val, val.name);
        } else {
          data.append(key, val);
        }
      }
    });

    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          try {
            _done(JSON.parse(request.response));
          } catch (e) {
            _done({});
          }
        } else {
          _fail();
        }
      }
    };

    request.upload.addEventListener('progress', e => {
      _progress(Math.ceil((e.loaded / e.total) * 100));
    }, false);

    request.open('POST', url, true);
    if (headers) {
      Object.keys(headers).forEach((key) => {
        request.setRequestHeader(key, headers[key]);
      });
    }
    request.send(data);
  }

  _instance.progress = progress;
  _instance.done = done;
  _instance.fail = fail;
  _post();
  return _instance;
}
