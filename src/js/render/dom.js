/**
 * Returns a array of child elements of the passed element that match the passed type. Type is
 * optional, if not defined will match all children.
 */
export function children(ele, type) {
  const result = [];
  const c = ele.children;
  const name = (type || '').toLowerCase();
  for (let x = 0; x < c.length; x++) {
    const child = c.item(x);
    if (!type || child.nodeName.toLowerCase() === name) {
      result.push(child);
    }
  }
  return result;
}

/**
 * Adds the passed classes to the passed DOM element.
 */
export function addClass(ele, ...cls) {
  const classes = !!ele.className ? ele.className.split(' ') : [];
  cls.forEach((c) => {
    if (classes.indexOf(c) < 0) {
      classes.push(c);
    }
  });
  ele.className = classes.join(' ');
}

/**
 * Removes the passed classes from the passed DOM element.
 */
export function removeClass(ele, ...cls) {
  const classes = !!ele.className ? ele.className.split(' ') : [];
  cls.forEach((c) => {
    const index = classes.indexOf(c);
    if (index >= 0) {
      classes.splice(index, 1);
    }
  });
  ele.className = classes.join(' ');
}

/**
 * Creates and retusn a new DOM element with the defined name. Attributes is optional, must be an
 * object, if defined sets the attribute key and value from the enumerable properties on the object.
 */
export function make(name, attributes) {
  const ele = document.createElement(name);
  if (attributes) {
    Object.keys(attributes)
      .forEach((key) => {
        if (key === 'class') {
          addClass(ele, ...(attributes[key] || '').split(' '));
        } else {
          ele.setAttribute(key, attributes[key]);
        }
      });
  }
  return ele;
}

/**
 * Appends the passed children to the passed element.
 */
export function append(ele, ...appendChildren) {
  appendChildren.forEach((child) => {
    ele.appendChild(child);
  });
}

function makeMarkerKey(key, postfix) {
  return `up-marker-${key}-${postfix}`;
}

/**
 * Creates a marker that is appended to the element with the defined key.
 */
export function marker(ele, key) {
  append(
    ele,
    document.createComment(makeMarkerKey(key, 'start')),
    document.createComment(makeMarkerKey(key, 'end'))
  );
}

/**
 * Replaces the content inside the marker and replaces it with the supplied contents
 */
export function replaceMarker(ele, key, ...contents) {
  const markerStart = makeMarkerKey(key, 'start');
  const markerEnd = makeMarkerKey(key, 'end');
  let processing = false;

  let node = ele.firstChild;
  const insert = (to, n) => node.parentNode.insertBefore(n, to);

  while (node) {
    if (node.nodeType === 8) {
      if (node.nodeValue === markerStart) {
        processing = true;
        node = node.nextSibling;
        continue;
      } else if (node.nodeValue === markerEnd) {
        contents.forEach(insert.bind(undefined, node));
        return;
      }
    }

    if (processing) {
      const next = node.nextSibling;
      node.parentNode.removeChild(node);
      node = next;
      continue;
    }

    node = node.nextSibling;
  }
}

/**
 * Removes all child nodes from the passed element.
 */
export function empty(ele) {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
}

/**
 * Gets the attributes from the passed element and returns a keyed object.
 */
export function attrs(ele, ...attributes) {
  const result = {};
  attributes.forEach((attr) => {
    result[attr] = ele.getAttribute(attr);
  });
  return result;
}

/**
 * Adds event listener to the passed element.
 */
export function on(ele, event, handler) {
  ele.addEventListener(event, handler);
}

/**
 * Remove event listener from the passed element.
 */
export function off(ele, event, handler) {
  ele.removeEventListener(ele, event, handler);
}

/**
 * Sets the value on the object using the path. Grows the object deep until the end of the path is
 * reached.
 */
export function set(obj, path, val) {
  let setOn = obj;
  const parts = path.split('.');
  const last = parts.pop();
  parts.forEach((part) => {
    let next = setOn[part];
    if (!next) {
      next = {};
      setOn[part] = next;
    }
    setOn = next;
  });
  if (typeof setOn === 'object') {
    setOn[last] = val;
  }
}

/**
 * Extracts data attributes from the passed element where they start with the prefix and returns a
 * key object. An optional shape parameter can be defined that defines the shape of the result.
 * For example:
 * shape = { test: 'some.bit', other: 'thing' }
 * <... data-test-key1="val" data-other="val2" />
 * result = { some: { bit: { key1: 'val' } }, thing: 'val2' }
 */
export function data(ele, prefix = '', shape = {}) {
  const result = {};
  Object.keys(ele.dataset)
    .filter(key => key.startsWith(prefix))
    .forEach((key) => {
      let adjusted = key.substr(prefix.length);
      adjusted = adjusted.charAt(0).toLowerCase() + adjusted.slice(1);
      let path = '';
      let best = 0;
      Object.keys(shape).forEach((sk) => {
        const idx = adjusted.indexOf(sk);
        if (idx >= 0 && best < sk.length) {
          best = sk.length;
          const rest = adjusted.slice(sk.length);
          path = shape[sk] + (rest ? `.${rest.charAt(0).toLowerCase() + rest.slice(1)}` : '');
        }
      });
      set(result, path || adjusted, ele.dataset[key]);
    });
  return result;
}
