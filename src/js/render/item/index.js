import { make, append, addClass } from '../util/dom';

export const TYPE_IMAGE = 'image';

/**
 * Renders a item type of image.
 */
export function imageRenderer(data) {
  return make('img', { src: data.src });
}

/**
 * Map of renderers by type.
 */
const renderers = {
  [TYPE_IMAGE]: imageRenderer,
};

function wrap(ele) {
  const root = make('div', { class: 'item' });
  append(root, ele);
  return root;
}

/**
 * The item module is a wrapper around an item in the container that the user can interact with.
 */
export default function item(data) {
  let _ele;
  let _wrapper;

  const renderer = renderers[data.type];
  if (renderer) {
    _ele = renderer(data);
    _wrapper = wrap(_ele);
  }

  return {
    appendTo(ele) {
      ele.appendChild(_wrapper);
    },
    uploading() {
      addClass(_wrapper, 'uploading');
    },
  };
}
