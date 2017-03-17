import { addClass, removeClass, append, make, on, off, data } from './dom';
import item, { TYPE_IMAGE } from './item';
import options from '../core/util/options';
import merge from '../core/util/merge';

function makeAdd() {
  const ele = make('div', { class: 'item new' });
  const icon = make('div', { class: 'icon plus' });
  append(ele, icon);
  return ele;
}

function makePicker(trigger, events, state, max) {
  const ele = make('input', {
    type: 'file',
    multiple: 'multiple',
  });
  on(ele, 'change', () => {
    const id = Date.now();
    for (let x = 0; x < ele.files.length && state.count + x < max; x++) {
      events.trigger('file.picked', { file: ele.files.item(x), id: `${x}_${id}` });
    }
  });

  const onClick = () => ele.click();
  on(trigger, 'click', onClick);

  events.on('destroy', () => {
    off(trigger, 'click', onClick);
  });

  return ele;
}

/**
 * The container module is a wrapper around the upload container.
 */
export default function container(ele, items, events, defaultOpt, opts) {
  const _state = {
    count: 0,
  };
  addClass(ele, 'uploadjs');

  const _dataOpts = data(ele, 'upload', {
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
  const _opts = options(merge({}, [defaultOpt, _dataOpts, opts]));

  _opts.get('max', (max) => {
    const _items = make('div', { class: 'uploadjs-container' });
    const _actions = make('div', { class: 'uploadjs-container' });

    const _toAdd = items.slice(0, max);
    _state.count = _toAdd.length;
    append(_items, ..._toAdd);
    append(ele, _items, _actions);

    const _add = makeAdd();
    append(_actions, _add);
    append(ele, makePicker(_add, events, _state, max));

    events.on('upload.added', ({ file, id }) => {
      const i = item({ type: TYPE_IMAGE, fileId: id, file, events });
      append(_items, i);
    });

    const hideShowAdd = (change) => {
      if (_state.count + change < max) {
        removeClass(_add, 'hide');
      } else {
        addClass(_add, 'hide');
      }
    };

    events.on('file.picked', hideShowAdd.bind(null, 1));
    events.on('item.removed', hideShowAdd.bind(null, -1));

    items.splice(0, items.length);
  });

  events.on('destroy', () => {
    ele.parentNode.removeChild(ele);
  });

  return _opts;
}
