import parse from './render/parse';
import core from './core';
import http from './core/util/http';
import events from './core/util/events';
import defaultOpts from './defaults';

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
    this._events = events([
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
    const _uiEvents = events([
      'file.picked',
      'file.delete',
      'item.removed',
    ]);
    this._events.emit(_uiEvents);

    const _opts = parse(ele, _uiEvents, defaultOpts, opts);
    const _core = core(http, this._events, _opts);

    _uiEvents.on('file.picked', ev => _core.upload(ev));
    _uiEvents.on('file.delete', ev => _core.del(ev.id));
  }

  on(event, handler) {
    event.split(' ').forEach((ev) => {
      this._events.on(ev, handler);
    });
    return this;
  }
};
