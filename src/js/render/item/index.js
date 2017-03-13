import { make, append, marker, replaceMarker, addClass, removeClass } from '../util/dom';

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
  marker(root, 'actions');

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
 * Makes the actions bar DOM
 */
function makeActions(ele) {
  const actions = make('div', { class: 'actions' });
  const del = make('div', { class: 'action del' });
  append(actions, del);
  append(del, make('div', { class: 'trash' }));
  replaceMarker(ele, 'actions', actions);
}

/**
 * The item module is a wrapper around an item in the container that the user can interact with.
 */
export default function item(data) {
  const _wrapper = wrap((renderers[data.type] || renderers.NOOP)(data));

  if (data.id) {
    makeActions(_wrapper.ele);
  } else {
    addClass(_wrapper.ele, 'static');
  }

  if (data.file) {
    data.events.on('upload.progress', data.id, ({ progress }) => {
      const val = 0 - (100 - progress);
      _wrapper._progress.style.transform = `translateX(${val}%)`;
    });

    data.events.on('upload.done', data.id, ({ id }) => {
      const ele = make('div', { class: 'icon done' });
      append(ele, make('i'));
      replaceMarker(_wrapper.ele, 'status', ele);

      data.fileId = id;

      if (id) {
        makeActions(_wrapper.ele);

        setTimeout(() => {
          addClass(ele, 'going');
          setTimeout(() => {
            replaceMarker(_wrapper.ele, 'status');
            removeClass(ele, 'going');
            removeClass(_wrapper.ele, 'uploading');
          }, 2000);
        }, 2000);
      } else {
        removeClass(_wrapper.ele, 'uploading');
        addClass(_wrapper.ele, 'static');
      }
    });
  }

  return _wrapper.ele;
}
