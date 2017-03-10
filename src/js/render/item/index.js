import { make, append, marker, replaceMarker } from '../util/dom';

export const TYPE_IMAGE = 'image';

/**
 * Renders a item type of image.
 */
export function imageRenderer(data) {
  if (data.file) {
    const ele = make('img');
    const reader = new FileReader();
    reader.onload = (e) => {
      ele.setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(data.file);
    return Object.assign({}, data, { ele });
  }
  return Object.assign({}, data, { ele: make('img', { src: data.src }) });
}

/**
 * Map of renderers by type.
 */
const renderers = {
  NOOP: () => make('div'),
  [TYPE_IMAGE]: imageRenderer,
};

/**
 * Wrapping DOM around the item DOM
 */
function wrap(data) {
  const isUploading = !!data.file;
  const root = make('div', {
    class: ['item'].concat(isUploading ? ['uploading'] : []).join(' '),
  });
  append(root, data.ele);
  marker(root, 'status');

  let _progress;
  if (isUploading) {
    _progress = make('div', { class: 'progress' });
    replaceMarker(
      root,
      'status',
      make('div', { class: 'spinner' }),
      make('div', { class: 'icon upload' }),
      _progress
    );
  }

  return Object.assign({}, data, { ele: root, _progress });
}

/**
 * The item module is a wrapper around an item in the container that the user can interact with.
 */
export default function item(data) {
  const _wrapper = wrap((renderers[data.type] || renderers.NOOP)(data));

  data.events.on('upload.progress', ({ file, progress }) => {
    if (file === data.file) {
      const val = 0 - (100 - progress);
      _wrapper._progress.style.transform = `translateX(${val}%)`;
    }
  });

  return _wrapper.ele;
}
