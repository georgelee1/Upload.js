/**
 * The delete module handles the deletion of a file by id
 */
export default function fileDelete(http, events, opts, queue) {
  /**
   * @private
   */
  function _peformDelete(id, done) {
    events.trigger('delete.started', { id });
    opts.get('delete.url', 'delete.param', 'delete.additionalParams', 'delete.headers',
      (url, param, additionalParams, headers) => {
        const params = Object.assign({}, additionalParams, {
          [param]: id,
        });

        http(url, params, headers)
          .done(({ success }) => {
            if (success === true || success === 'true') {
              events.trigger('delete.done', { id });
            } else {
              events.trigger('delete.failed', { id });
            }
            done();
          })
          .fail(() => {
            events.trigger('delete.failed', { id });
            done();
          });
      });
  }

  /**
   * Delete one or more files.
   */
  function del(...ids) {
    ids.forEach((id) => {
      events.trigger('delete.added', { id });
      queue.offer((done) => _peformDelete(id, done));
    });
  }

  return {
    del,
  };
}
