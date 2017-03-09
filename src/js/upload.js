import parse from './render/parse';
import core from './core';
import http from './core/util/http';
import events from './core/util/events';
import options from './core/util/options';

const DEFAULTS = {
  types: {
    images: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
  },
  allowed_types: ['images'],
};

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function merge(target, ...objs) {
  if (!objs.length) return target;
  const next = objs.shift();

  if (isObject(target) && isObject(next)) {
    Object.keys(next)
      .forEach((key) => {
        if (isObject(next[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          merge(target[key], next[key]);
        } else {
          Object.assign(target, {
            [key]: next[key],
          });
        }
      });
  }

  return merge(target, ...objs);
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
    const _container = parse(ele);

    const _events = events();
    const _opts = options(merge({}, DEFAULTS, opts));
    const _core = core(http, _events, _opts);

    _container.onPicked((files) => _core.upload(...files));

    _events.on('upload.started', ({ file }) => {
      _container.add(file);
    });
  }
};
