import queue from './util/queue';
import fileUpload from './actions/upload';
import fileDelete from './actions/delete';

/**
 * The core is the engine that handles the uploading and deleting of files.
 */
export default function core(http, events, opts) {
  const _queue = queue((item, done) => {
    item(done);
  }, { delay: 100 });

  const upload = fileUpload(http, events, opts, _queue);
  const del = fileDelete(http, events, opts, _queue);

  return {
    upload: upload.upload,
    del: del.del,
    destroy() {
      _queue.clear();
    },
  };
}
