import options from '../../../src/js/core/util/options';
import should from 'should';

describe('Options', () => {
  let o;

  before(() => {
    const opts = {
      key1: 'val1',
      key2: () => 'val2',
      key3: (done) => {
        setTimeout(() => {
          done('val3');
        }, 200);
      },
      key4: {
        key5: 'val5',
      },
    };

    o = options(opts);
  });

  describe('#get', () => {
    it('should return value for plain value', () => {
      o.get('key1').should.be.exactly('val1');
    });

    it('should return undefined for non existing property', () => {
      should(o.get('key5.key6')).be.Undefined();
    });

    it('callback should be called with value for plain value', () => {
      let result;
      const callback = v => {
        result = v;
      };
      should(o.get('key1', callback)).be.Undefined();
      should(result).be.exactly('val1');
    });

    it('should return value for function value', () => {
      o.get('key2').should.be.equal('val2');
    });

    it('callback should be called with value for function value', () => {
      let result;
      const callback = v => {
        result = v;
      };
      should(o.get('key2', callback)).be.Undefined();
      should(result).be.exactly('val2');
    });

    it('should return undefined for function value with done', () => {
      should(o.get('key3')).be.Undefined();
    });

    it('callback should be called with value for function value with done', function(done) {
      this.timeout(250);
      const start = Date.now();
      should(o.get('key3', v => {
        (Date.now() - start).should.be.approximately(200, 20);
        should(v).be.exactly('val3');
        done();
      })).be.Undefined();
    });

    it('should return value for nested value', () => {
      should(o.get('key4.key5')).be.exactly('val5');
    });

    it('should return values for multiple keys', () => {
      o.get('key1', 'key2').should.be.eql(['val1', 'val2']);
    });

    it('callback should be called with multiple values, one plain, one function', () => {
      let result;
      const callback = (...args) => {
        result = args;
      };
      should(o.get('key1', 'key2', callback)).be.Undefined();
      result.should.be.eql(['val1', 'val2']);
    });

    it('callback should be called with multiple values, one plain, one function with done',
      function(done) {
        this.timeout(1100);
        const start = Date.now();
        should(o.get('key1', 'key3', (...args) => {
          (Date.now() - start).should.be.approximately(200, 20);
          should(args).be.eql(['val1', 'val3']);
          done();
        })).be.Undefined();
      });
  });
});
