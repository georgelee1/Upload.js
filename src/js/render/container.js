import { addClass, append, make, on, data } from './dom';
import item, { TYPE_IMAGE } from './item';

function makeAdd() {
  const ele = make('div', { class: 'item new' });
  const icon = make('div', { class: 'icon plus' });
  append(ele, icon);
  return ele;
}

function makePicker(trigger, events) {
  const ele = make('input', {
    type: 'file',
    multiple: 'multiple',
  });
  on(ele, 'change', () => {
    const id = Date.now();
    for (let x = 0; x < ele.files.length; x++) {
      events.trigger('file.picked', { file: ele.files.item(x), id: `${x}_${id}` });
    }
  });
  on(trigger, 'click', ele.click.bind(ele));
  return ele;
}

/**
 * The container module is a wrapper around the upload container.
 */
export default function container(ele, items, events) {
  addClass(ele, 'uploadjs');

  const _items = make('div', { class: 'uploadjs-container' });
  append(_items, ...items);

  const _actions = make('div', { class: 'uploadjs-container' });
  append(ele, _items, _actions);

  const _add = makeAdd();
  append(_actions, _add);
  append(ele, makePicker(_add, events));

  events.on('upload.added', ({ file, id }) => {
    const i = item({ type: TYPE_IMAGE, fileId: id, file, events });
    append(_items, i);
  });

  items.splice(0, items.length);

  return data(ele, 'upload', {
    url: 'upload.url',
    param: 'upload.param',
    deleteUrl: 'delete.url',
    deleteParam: 'delete.param',
    allowedTypes: 'allowed_types',
    additionalParam: 'upload.additionalParams',
    header: 'upload.headers',
    deleteAdditionalParam: 'delete.additionalParams',
    deleteHeader: 'delete.headers',
  });
}
