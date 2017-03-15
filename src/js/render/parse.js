import { children, empty, attrs } from './dom';
import item, { TYPE_IMAGE } from './item';
import container from './container';

function parseImage(ele, events) {
  return item(
    Object.assign({ type: TYPE_IMAGE },
      attrs(ele, 'src'), { id: ele.dataset.uploadImageId, events }
    )
  );
}

/**
 * The parse module parses the DOM element and returns a container wrapper element.
 */
export default function parse(ele, events) {
  const items = children(ele, 'img').map(img => parseImage(img, events));
  empty(ele);
  return container(ele, items, events);
}
