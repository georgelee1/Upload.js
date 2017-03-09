import { children, empty, attrs } from '../util/dom';
import item, { TYPE_IMAGE } from '../item';
import container from '../container';

function parseImage(ele) {
  return item(Object.assign({ type: TYPE_IMAGE }, attrs(ele, 'src')));
}

/**
 * The parse module parses the DOM element and returns a container wrapper element.
 */
export default function parse(ele) {
  const items = children(ele, 'img').map(img => parseImage(img));
  empty(ele);
  return container(ele, items);
}
