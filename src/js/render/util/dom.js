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
