import { Widget } from './ui/widget';
import { Http } from './util/http';

/**
 * Wraps the passed function in closure that calls the function with the 'this' value
 * passed as the first argument.
 */
function contextFunctionWrapperFactory(funct) {
  return function contextFunctionWrapper(... args) {
    return funct.apply(this, [this, ... args]);
  };
}

/**
 * Default options for the UploadJs widget
 */
const DEFAULTS = {
  // template Strings
  template: {
    item: 'div.item (img)',
    add: 'div.item.new (div.icon.plus)',
    actions: 'div.actions (div.action.del (div.trash))',
    deleting: 'div.spinner div.icon.trash',
    uploading: 'div.spinner div.icon.upload div.progress',
    done: 'div.icon.done (i)',
    error: 'div.icon.error (i)',
  },
  max: contextFunctionWrapperFactory((ele) => parseInt(ele.dataset.uploadMax, 10) || 0),
  deletable: contextFunctionWrapperFactory((ele) => ele.dataset.uploadDeletable !== 'false'),
  types: {
    images: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
  },
  allowed_types: contextFunctionWrapperFactory((ele) => {
    if (typeof ele.dataset.uploadAllowedTypes === 'undefined') {
      return ['images'];
    }
    return ele.dataset.uploadAllowedTypes.split(',');
  }),
  upload: {
    url: contextFunctionWrapperFactory((ele) => ele.dataset.uploadUrl),
    param: contextFunctionWrapperFactory((ele) => ele.dataset.uploadParam || 'file'),
    additionalParams: contextFunctionWrapperFactory((ele) => {
      const additional = {};
      const prefix = 'uploadAdditionalParam';
      Object.keys(ele.dataset).forEach((key) => {
        if (key.startsWith(prefix)) {
          additional[key.substr(prefix.length)] = ele.dataset[key];
        }
      });
      return additional;
    }),
    headers: contextFunctionWrapperFactory((ele) => {
      const headers = {};
      const prefix = 'uploadHeader';
      Object.keys(ele.dataset).forEach((key) => {
        if (key.startsWith(prefix)) {
          headers[key.substr(prefix.length)] = ele.dataset[key];
        }
      });
      return headers;
    }),
  },
  delete: {
    url: contextFunctionWrapperFactory((ele) => ele.dataset.uploadDeleteUrl),
    param: contextFunctionWrapperFactory((ele) => ele.dataset.uploadDeleteParam || 'file'),
    additionalParams: contextFunctionWrapperFactory((ele) => {
      const additional = {};
      const prefix = 'uploadDeleteAdditionalParam';
      Object.keys(ele.dataset).forEach((key) => {
        if (key.startsWith(prefix)) {
          additional[key.substr(prefix.length)] = ele.dataset[key];
        }
      });
      return additional;
    }),
    headers: contextFunctionWrapperFactory((ele) => {
      const headers = {};
      const prefix = 'uploadDeleteHeader';
      Object.keys(ele.dataset).forEach((key) => {
        if (key.startsWith(prefix)) {
          headers[key.substr(prefix.length)] = ele.dataset[key];
        }
      });
      return headers;
    }),
  },
  http: () => (url, params, headers) => new Http(url, params, headers),
};

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
  constructor(ele, opts = {}) {
    this._widget = new Widget(ele, opts, DEFAULTS);
  }

  /**
   * Register an event listener with UploadJs
   *
   * @param event Event name, can be `upload.added`, `upload.`started`, `upload.progress`,
   * `upload.done`, `upload.failed`, `delete.added`, `delete.started`, `delete.done`, `delete.fail`
   */
  on(event, handler) {
    event.split(' ').forEach(e => {
      this._widget._addListener(e, handler);
    });
    return this;
  }
};
