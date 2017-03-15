const ALL = '$all';

/**
 * The events module handles registering of event listeners and triggering of events.
 */
export default function events(known = []) {
  let _byKey = {};
  let _emit = [];
  let _parents = [];

  function isDefined(val) {
    return val && typeof val !== 'undefined' && !(typeof val === 'object' && !val);
  }

  /**
   * Register event listener
   */
  function on(key, id, listener) {
    const available = known.concat(_parents.reduce((val, next) => val.concat(next), []));
    if (available.length && available.indexOf(key) < 0) {
      console.warn('Attemping to listen to an unknown event. ' +
        `'${key}' is not one of '${available.join(', ')}'`);
    }
    if (typeof id === 'function') {
      listener = id;
      id = ALL;
    }
    const actualId = isDefined(id) ? (id).toString() : ALL;
    if (typeof listener === 'function') {
      if (!_byKey[key]) {
        _byKey[key] = {
          [ALL]: [],
        };
      }
      if (!_byKey[key][actualId]) {
        _byKey[key][actualId] = [];
      }
      _byKey[key][actualId].push(listener);
    }
  }

  /**
   * Unregister event listener
   */
  function off(key, id, handler) {
    if (_byKey[key]) {
      if (typeof id === 'function') {
        handler = id;
        id = false;
      }
      const actualId = isDefined(id) ? (id).toString() : false;
      if (actualId) {
        if (handler) {
          const handlers = _byKey[key][actualId];
          if (handlers) {
            const idx = handlers.indexOf(handler);
            if (idx >= 0) {
              handlers.splice(idx, 1);
            }
          }
        } else {
          delete _byKey[key][actualId];
        }
      } else if (handler) {
        Object.keys(_byKey[key]).forEach((i) => {
          const handlers = _byKey[key][i];
          if (handlers) {
            const idx = handlers.indexOf(handler);
            if (idx >= 0) {
              handlers.splice(idx, 1);
            }
          }
        });
      } else {
        _byKey[key] = {
          [ALL]: [],
        };
      }
    }
  }

  /**
   * Triggers event with key and parameters
   */
  function trigger(key, event) {
    if (_byKey[key]) {
      const id = event && isDefined(event.id) ? (event.id).toString() : false;
      if (id) {
        (_byKey[key][id] || []).forEach(listener => listener(Object.assign({ type: key }, event)));
        _byKey[key][ALL].forEach(listener => listener(Object.assign({ type: key }, event)));
      } else {
        Object.keys(_byKey[key]).forEach((i) => {
          _byKey[key][i].forEach(listener => listener(Object.assign({ type: key }, event)));
        });
      }
    }
    _emit.forEach(ev => ev.trigger(key, event));
  }

  /**
   * Emits events trigger in this events instance to the passed events instance.
   */
  function emit(ev) {
    if (ev && ev.trigger) {
      _emit.push(ev);
      ev._parent(known);
    }
  }

  /**
   * Removes all listeners from the events
   */
  function clear() {
    _byKey = {};
    _emit = [];
    _parents = [];
  }

  return {
    on,
    off,
    trigger,
    emit,
    _parent(ev) {
      _parents.push(ev);
    },
    clear,
  };
}
