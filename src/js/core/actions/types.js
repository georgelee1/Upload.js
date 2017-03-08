/**
 * Types module. Gets and parses pre-defined types and allowed types, exposes
 * an isAllowed function to test whether a type is allowed or not.
 */
export default function types(opts) {
  let allowed;
  let waiting = [];

  /**
   * Returns true of false if the passed type is an allowed type.
   * @private
   */
  function _checkIsAllowed(type) {
    return allowed.indexOf(type.toLowerCase()) >= 0;
  }

  /**
   * Calls the callback with true or false whether or not the type is allowed.
   */
  function isAllowed(type, callback) {
    if (waiting) {
      waiting.push([type, callback]);
      if (waiting.length === 1) {
        opts.get('allowed_types', 'types', (optAllowedTypes = [], optTypes = {}) => {
          allowed = [].concat.apply([], optAllowedTypes.map(t => optTypes[t] || t))
            .map(t => t.toLowerCase());
          waiting.forEach(([waitingType, waitingCallback]) =>
            waitingCallback(_checkIsAllowed(waitingType)));
          waiting = undefined;
        });
      }
    } else {
      callback(_checkIsAllowed(type));
    }
  }

  return {
    isAllowed,
  };
}
