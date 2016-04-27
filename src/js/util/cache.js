/**
 * A simple cache. When attempting to add to a full cache entries are evicted to make space (LRU).
 * The auto eviction only occurs when a max size has been defined for the map.
 *
 * Usage:
 * let cache = new Cache(max=5)
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
 *
 * @class
 */
export class Cache {
  constructor(max = 0) {
    this._max = max;
    this._map = {};
    this._head = {};
    this._tail = { prev: this._head };
    this._head.next = this._tail;
    this.length = 0;
  }

  /**
   * Get value mapped to the passed key in the cache.
   */
  get(key) {
    const entry = this._map[key];
    this._insertAtTail(entry);
    return entry ? entry.val : undefined;
  }

  /**
   * Put the passed value mapped against the passed key in the cache. If a mapping with the same
   * key already exists it will be overridden. True is returned if this is a new mapping being
   * added, otherwise false if being overridden.
   */
  put(key, val) {
    if (this._max > 0 && this.length > 0 && this.length === this._max) {
      this.remove(this._head.next.key);
    }
    let entry = this._map[key];
    let newEntry = true;
    if (entry) {
      entry.val = val;
      newEntry = false;
    } else {
      entry = { key, val };
      this._map[key] = entry;
      this.length++;
    }
    this._insertAtTail(entry);
    return newEntry;
  }

  /**
   * Remove the entry from the cache against the mapped key. Returns the current value mapped.
   */
  remove(key) {
    const entry = this._map[key];
    if (entry) {
      delete this._map[key];
      this._evict(entry);
      this.length--;
      return entry.val;
    }
    return undefined;
  }

  /**
   * @private
   */
  _evict(entry) {
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
  _insertAtTail(item) {
    const entry = item;
    if (entry) {
      if (entry.next) {
        this._evict(entry);
      }
      entry.prev = this._tail.prev;
      entry.prev.next = entry;
      entry.next = this._tail;
      this._tail.prev = entry;
    }
  }
}
