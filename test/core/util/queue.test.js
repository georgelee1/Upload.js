import should from 'should'; // eslint-disable-line no-unused-vars
import queue from '../../../src/js/core/util/queue';

describe('Queue', () => {
  describe('#offer', () => {
    it('should process all with default options', function(done) {
      this.timeout(1100);
      const start = Date.now();
      const q = queue((item, fin) => {
        setTimeout(() => {
          fin();
          if (item === 9) {
            (Date.now() - start).should.be.approximately(1000, 40);
            done();
          }
        }, 100);
      });
      for (let x = 0; x < 10; x++) {
        q.offer(x).should.be.True();
      }
    });

    it('should process more than one at a time', function(done) {
      this.timeout(600);
      const opts = {
        concurrency: 2,
      };
      const start = Date.now();
      const q = queue((item, fin) => {
        setTimeout(() => {
          fin();
          if (item === 9) {
            (Date.now() - start).should.be.approximately(500, 40);
            done();
          }
        }, 100);
      }, opts);
      for (let x = 0; x < 10; x++) {
        q.offer(x).should.be.True();
      }
    });

    it('should reject when offering more than the max size', () => {
      const opts = {
        size: 1,
      };
      const q = queue((item, fin) => {
        setTimeout(() => {
          fin();
        }, 100);
      }, opts);
      q.offer(0).should.be.True();
      q.offer(1).should.be.True();
      q.offer(2).should.be.False();
    });

    it('should delay the start of the item execution', function(done) {
      this.timeout(300);
      const opts = {
        delay: 200,
      };
      const start = Date.now();
      const q = queue((item, fin) => {
        (Date.now() - start).should.be.approximately(200, 40);
        fin();
        done();
      }, opts);
      q.offer(0).should.be.True();
    });
  });
});
