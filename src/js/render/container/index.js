import { addClass, append, make, on } from '../util/dom';
import item, { TYPE_IMAGE } from '../item';

function makeAdd() {
  const ele = make('div', { class: 'item new' });
  const icon = make('div', { class: 'icon plus' });
  append(ele, icon);
  return ele;
}

function makePicker(trigger, handler) {
  const ele = make('input', {
    type: 'file',
    multiple: 'multiple',
  });
  on(ele, 'change', () => {
    const list = [];
    for (let x = 0; x < ele.files.length; x++) {
      list.push(ele.files.item(x));
    }
    handler(list);
  });
  on(trigger, 'click', ele.click.bind(ele));
  return ele;
}

/**
 * The container module is a wrapper around the upload container.
 */
export default function container(ele, items) {
  const _items = make('div', { class: 'uploadjs-container' });
  const _actions = make('div', { class: 'uploadjs-container' });
  append(ele, _items);
  append(ele, _actions);

  const _add = makeAdd();
  let _onPicked;

  addClass(ele, 'uploadjs');

  items.forEach((i) => {
    i.appendTo(_items);
  });

  append(_actions, _add);
  append(ele, makePicker(_add, (files) => {
    if (_onPicked) {
      _onPicked(files);
    }
  }));

  return {
    onPicked(listener) {
      _onPicked = listener;
    },
    add(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const i = item({
          type: TYPE_IMAGE,
          src: e.target.result,
        });
        i.uploading();
        items.push(i);
        i.appendTo(_items);
      };
      reader.readAsDataURL(file);
    },
  };
}
