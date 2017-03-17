import parse from './render/parse';
import core from './core';
import http from './core/util/http';
import events from './core/util/events';
import defaultOpts from './defaults';

function up(ele, opts = {}) {
  let _events = events([
    'upload.added',
    'upload.started',
    'upload.progress',
    'upload.done',
    'upload.failed',
    'delete.added',
    'delete.started',
    'delete.done',
    'delete.failed',
  ]);
  let _uiEvents = events([
    'file.picked',
    'file.delete',
    'item.removed',
    'destroy',
  ]);
  _events.emit(_uiEvents);

  let _opts = parse(ele, _uiEvents, defaultOpts, opts);
  let _core = core(http, _events, _opts);

  _uiEvents.on('file.picked', ev => _core.upload(ev));
  _uiEvents.on('file.delete', ev => _core.del(ev.id));

  return {
    on(event, handler) {
      if (_events) {
        event.split(' ').forEach((ev) => {
          _events.on(ev, handler);
        });
      }
      return this;
    },
    destroy() {
      if (_uiEvents) {
        _uiEvents.trigger('destroy');

        _events.clear();
        _uiEvents.clear();
        _core.destroy();

        _events = undefined;
        _uiEvents = undefined;
        _opts = undefined;
        _core = undefined;
      }
    },
  };
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
  constructor(ele, opts = {}) {
    this._up = up(ele, opts);
  }

  on(event, handler) {
    this._up.on(event, handler);
    return this;
  }

  destroy() {
    this._up.destroy();
    return this;
  }
};
