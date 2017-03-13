import { make, append, marker, replaceMarker, addClass, removeClass, on } from '../util/dom';

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
function makeActions(ele, data) {
  if (data.id) {
    const actions = make('div', { class: 'actions' });
    const del = make('div', { class: 'action del' });
    append(actions, del);
    append(del, make('div', { class: 'trash' }));
    replaceMarker(ele, 'actions', actions);

    on(del, 'click', () => data.events.trigger('file.delete', { id: data.id }));
  } else {
    addClass(ele, 'static');
  }
}

/**
 * Makes the appropriate status icon and appends to the status marker. Then removes after a short
 * period.
 */
function status(ele, st) {
  const s = make('div', { class: `icon ${st}` });
  append(s, make('i'));
  replaceMarker(ele, 'status', s);

  setTimeout(() => {
    addClass(s, 'going');
    setTimeout(() => {
      replaceMarker(ele, 'status');
      removeClass(s, 'going');
    }, 2000);
  }, 2000);
}

/**
 * Remove all upload events
 */
function removeUploadEvents(data) {
  data.events.off('upload.progress', data.fileId);
  data.events.off('upload.done', data.fileId);
  data.events.off('upload.failed', data.fileId);
}

/**
 * Remove the item
 */
function remove(ele, data) {
  setTimeout(() => {
    addClass(ele, 'removed');
    setTimeout(() => {
      ele.parentNode.removeChild(ele);
    }, 1000);
  }, 3000);

  removeUploadEvents(data);
}

/**
 * Add upload listeners to the events
 */
function onUpload(data, ele, progressEle) {
  data.events.on('upload.progress', data.fileId, ({ progress }) => {
    const val = 0 - (100 - progress);
    progressEle.style.transform = `translateX(${val}%)`;
  });

  data.events.on('upload.done', data.fileId, ({ id }) => {
    data.id = id;
    status(ele, 'done');
    removeClass(ele, 'uploading');
    makeActions(ele, { id });

    removeUploadEvents(data);
  });

  data.events.on('upload.failed', data.fileId, () => {
    addClass(ele, 'stopped');
    status(ele, 'error');
    remove(ele, data);
  });
}

/**
 * The item module is a wrapper around an item in the container that the user can interact with.
 */
export default function item(data) {
  const _wrapper = wrap((renderers[data.type] || renderers.NOOP)(data));

  if (data.file) {
    onUpload(data, _wrapper.ele, _wrapper._progress);
  } else {
    makeActions(_wrapper.ele, data);
  }

  return _wrapper.ele;
}
