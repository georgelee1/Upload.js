import parse from './render/parse';
import core from './core';
import http from './core/util/http';
import events from './core/util/events';
import options from './core/util/options';
import merge from './core/util/merge';
import defaults from './defaults';

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
    const _events = events([
      'upload.started',
      'upload.progress',
      'upload.done',
    ]);
    const _uiEvents = events([
      'file.picked',
    ]);
    _events.emit(_uiEvents);

    const _dataOpts = parse(ele, _uiEvents);
    const _opts = options(merge({}, defaults, _dataOpts, opts));
    const _core = core(http, _events, _opts);

    _uiEvents.on('file.picked', ev => _core.upload(ev.file));
  }
};
