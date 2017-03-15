module.exports = {
  /**
   * number | Maxiumum number of files that UploadJs will allow to contain.
   */
  max: Infinity,

  /**
   * object: {
   *   key: array
   * }
   * defined grouping of file types for allowed_types by MIME type
   */
  types: {
    images: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
  },
  /**
   * array | The allowed file types that can be uploaded. Either MIME type of grouping key (see
   *         types)
   */
  allowed_types: ['images'],

  /**
   * Http upload options
   */
  upload: {
    /**
     * string | The URL that is called when uploading a file
     */
    url: '',
    /**
     * string | The name of the parameter that each file is set as in the upload request.
     */
    param: 'file',
    /**
     * object | Keyed object of additional parameters to send with the upload request.
     */
    additionalParams: {},
    /**
     * object | Keyed object of additional headers to send with the upload request.
     */
    headers: {},
  },

  /**
   * Http delete options
   */
  delete: {
    /**
     * string | The URL that is called when deleting a file
     */
    url: '',
    /**
     * string | The name of the parameter set with the file id that is set on the deletion request.
     */
    param: 'file',
    /**
     * object | Keyed object of additional parameters to send with the delete request.
     */
    additionalParams: {},
    /**
     * object | Keyed object of additional headers to send with the delete request.
     */
    headers: {},
  },
};
