/**
 * A simple cache. When attempting to add to a full cache entries are evicted to make space (LRU).
 * The auto eviction only occurs when a max size has been defined for the map.
 *
 * Usage:
 * let cache = cache(5)
 * cache.put("test", "val") === true
 * cache.put("test", "val2") === false
 * cache.get("test") === "val2"
 * cache.remove("test") === "val2"
 * cache.get("test") === undefined
 *
 * // auto eviction
 * cache.put("test", "val") === true
 * cache.put("test1", "val1") === true
 * cache.put("test2", "val2") === true
 * cache.put("test3", "val3") === true
 * cache.put("test4", "val4") === true
 * cache.put("test5", "val5") === true // evicts oldest
 * cache.get("test") === undefined
 */
export default function cache(max) {
  const _map = {};
  const _head = {};
  const _tail = { prev: _head };
  _head.next = _tail;
  let _length = 0;

  /**
   * @private
   */
  function _evict(entry) {
    if (entry) {
      const prev = entry.prev;
      const next = entry.next;
      prev.next = next;
      next.prev = prev;
    }
  }

  /**
   * @private
   */
  function _insertAtTail(item) {
    const entry = item;
    if (entry) {
      if (entry.next) {
        _evict(entry);
      }
      entry.prev = _tail.prev;
      entry.prev.next = entry;
      entry.next = _tail;
      _tail.prev = entry;
    }
  }

  /**
   * Get value mapped to the passed key in the cache.
   */
  function get(key) {
    const entry = _map[key];
    _insertAtTail(entry);
    return entry ? entry.val : undefined;
  }

  /**
   * Remove the entry from the cache against the mapped key. Returns the current value mapped.
   */
  function remove(key) {
    const entry = _map[key];
    if (entry) {
      delete _map[key];
      _evict(entry);
      _length--;
      return entry.val;
    }
    return undefined;
  }

  /**
   * Put the passed value mapped against the passed key in the cache. If a mapping with the same
   * key already exists it will be overridden. True is returned if this is a new mapping being
   * added, otherwise false if being overridden.
   */
  function put(key, val) {
    if (max > 0 && _length > 0 && _length === max) {
      remove(_head.next.key);
    }
    let entry = _map[key];
    let newEntry = true;
    if (entry) {
      entry.val = val;
      newEntry = false;
    } else {
      entry = { key, val };
      _map[key] = entry;
      _length++;
    }
    _insertAtTail(entry);
    return newEntry;
  }

  return {
    get,
    put,
    remove,
  };
}
