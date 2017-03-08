import types from './types';

/**
 * The upload module handles the actual file upload mechanism
 */
export default function fileUpload(http, events, opts, queue) {
  const _types = types(opts);

  /**
   * @private
   */
  function _peformUpload(file, done) {
    opts.get('upload.url', 'upload.param', 'upload.additionalParams', 'upload.headers',
      (url, param, additionalParams, headers) => {
        const params = Object.assign({}, additionalParams, {
          [param]: file,
        });

        http(url, params, headers)
          .progress(progress => events.trigger('upload.progress', { file, progress }))
          .done(({ uploadImageId }) => {
            events.trigger('upload.done', { file, id: uploadImageId });
            done();
          })
          .fail(() => {
            events.trigger('upload.failed', { file });
            done();
          });
      });
  }

  /**
   * Upload one or more files.
   */
  function upload(...files) {
    files.forEach((file) => {
      _types.isAllowed(file.type, (allowed) => {
        if (allowed) {
          events.trigger('upload.started', { file });
          queue.offer((done) => _peformUpload(file, done));
        } else {
          events.trigger('upload.rejected', { file, rejected: 'type' });
        }
      });
    });
  }

  return {
    upload,
  };
}
