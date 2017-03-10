import { addClass, append, make, on, data } from '../util/dom';
import item, { TYPE_IMAGE } from '../item';

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
    for (let x = 0; x < ele.files.length; x++) {
      events.trigger('file.picked', { file: ele.files.item(x) });
    }
  });
  on(trigger, 'click', ele.click.bind(ele));
  return ele;
}

/**
 * The container module is a wrapper around the upload container.
 */
export default function container(ele, items, events) {
  const _items = make('div', { class: 'uploadjs-container' });
  const _actions = make('div', { class: 'uploadjs-container' });
  append(ele, _items, _actions);

  const _add = makeAdd();
  addClass(ele, 'uploadjs');

  items.forEach((i) => {
    i.appendTo(_items);
  });

  append(_actions, _add);
  append(ele, makePicker(_add, events));

  events.on('upload.started', ({ file }) => {
    const i = item({
      type: TYPE_IMAGE,
      file,
    });
    items.push(i);
    i.appendTo(_items);
  });

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
