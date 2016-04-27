import { Item } from './item';

/**
 * DeleteItem handles the deleting of a file and the updating of the DOM elements
 */
export class DeleteItem extends Item {
  constructor(ele, widget, listeners) {
    super(ele, listeners);
    this._widget = widget;
    this._id = this._ele.data('uploadImageId');

    this._trigger({ type: 'delete.added', id: this._id });
  }

  /**
   * Starts the deletion
   */
  run(done) {
    this._trigger({ type: 'delete.started', id: this._id });
    const item = this;
    this._widget._opts.get(
      'delete.url', 'delete.param', 'delete.additionalParams', 'delete.headers',
      (url, param, additionalParams, headers) => {
        const params = Object.assign(additionalParams || {}, { [param]: item._id });
        item._widget._opts.get('http')(url, params, headers)
          .done(item._done.bind(item, done))
          .fail(item._fail.bind(item, done));
      });
  }

  /**
   * Triggered by the HTTP when the deletion has successfully completed
   *
   * @private
   */
  _done(done, data) {
    if (!data.success) {
      this._fail(done);
      return;
    }

    this._ele.removeClass('removing').addClass('removed');
    setTimeout(() => {
      this._ele.remove();
    }, 1000);

    this._trigger({ type: 'delete.done', id: this._id });
    done();
  }

  /**
   * Triggered by the HTTP when the deletion has failed
   *
   * @private
   */
  _fail(done) {
    this._ele.removeClass('removing');
    const error = this._widget._parser.parse(
      this._widget._opts.get('template.error')).appendTo(this._ele);

    setTimeout(() => {
      error.addClass('going');
      setTimeout(() => {
        error.remove();
      }, 3000);
    }, 2000);

    this._trigger({ type: 'delete.failed', id: this._id });
    done();
  }
}
