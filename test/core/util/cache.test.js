import cache from '../../../src/js/core/util/cache';
import should from 'should';

describe('Cache', () => {
  describe('#put', () => {
    it('should add and get entry to/from the cache', () => {
      const c = cache();
      c.put('test', 'val').should.be.True();
      c.get('test').should.be.exactly('val');
    });

    it('should override existing entry in the cache', () => {
      const c = cache();
      c.put('test', 'val').should.be.True();
      c.put('test', 'overridden').should.be.False();
      c.get('test').should.be.exactly('overridden');
    });

    it('should remove exiting entry from the cache', () => {
      const c = cache();
      c.put('test', 'val').should.be.True();
      c.remove('test').should.be.exactly('val');
      should(c.get('test')).be.Undefined();
    });

    it('should silently pass a removal attempt of an entry that doesnt exist', () => {
      const c = cache();
      c.put('test', 'val').should.be.True();
      should(c.remove('other')).be.Undefined();
      c.get('test').should.be.exactly('val');
    });

    it('should auto evict oldest entry when max size is reached', () => {
      const c = cache(5);
      c.put('test', 'val').should.be.True();
      c.put('test1', 'val1').should.be.True();
      c.put('test2', 'val2').should.be.True();
      c.put('test3', 'val3').should.be.True();
      c.get('test').should.be.exactly('val');
      c.put('test4', 'val4').should.be.True();
      c.put('test5', 'val5').should.be.True();
      c.get('test').should.be.exactly('val');
      should(c.get('test1')).be.Undefined();
    });
  });
});
