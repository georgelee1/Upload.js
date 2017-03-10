import should from 'should'; // eslint-disable-line no-unused-vars
import update from '../../../src/js/core/util/update';

describe('Update', () => {
  it('should trigger the handler when the value is set', function(done) {
    this.timeout(100);

    const u = update(v => {
      v.should.be.exactly('test');
      done();
    });

    u.value = 'test';
  });

  it('should trigger the handler with the latest value when more than more value set',
    function(done) {
      this.timeout(100);

      const u = update(v => {
        v.should.be.exactly('test');
        done();
      }, 50);

      u.value = 'something';
      u.value = 'test';
    });

  it('should trigger the handler when the value is set and then trigger again some time ' +
    'later with another value',
    function(done) {
      this.timeout(100);

      let first = true;
      const u = update(v => {
        if (first) {
          v.should.be.exactly('test');
          first = false;
        } else {
          v.should.be.exactly('test2');
          done();
        }
      });

      u.value = 'test';
      setTimeout(() => {
        u.value = 'test2';
      }, 50);
    });
});
