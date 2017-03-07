import types from '../../src/js/core/types';
import options from '../../src/js/core/util/options';
import should from 'should';

describe.only('types', () => {
  describe('Sync defined options', () => {
    let t;

    before(() => {
      t = types(options({
        types: {
          test: ['Val1', 'val2'],
        },
        allowed_types: ['val3', 'test'],
      }));
    });

    it('should call the callback with true as the type is explicitly allowed', (done) => {
      t.isAllowed('val3', (r) => {
        r.should.be.True;
        done();
      });
    });

    it('should call the callback with true as the type is implicitly allowed', (done) => {
      t.isAllowed('val1', (r) => {
        r.should.be.True;
        done();
      });
    });

    it('should call the callback with false as the type is not allowed', (done) => {
      t.isAllowed('val4', (r) => {
        r.should.be.False;
        done();
      });
    });
  });

  describe('Async defined options', () => {
    let t;

    before(() => {
      t = types(options({
        types: (done) => {
          setTimeout(() => {
            done({
              types: {
                test: ['Val1', 'val2'],
              },
            });
          }, 50);
        },
        allowed_types: (done) => {
          setTimeout(() => {
            done(['val3', 'test']);
          }, 55);
        },
      }));
    });

    it('should call both callbacks with true as the types are explicitly allowed', (done) => {
      let firstCall;
      t.isAllowed('val2', (r) => {
        firstCall = r;
      });
      t.isAllowed('val3', (r) => {
        should(firstCall).be.True;
        r.should.be.True;
        done();
      });
    });

    it('should call the first callback with false as it is not allowed and the second ' +
      'with true as the type is implicitly allowed',
      (done) => {
        let firstCall;
        t.isAllowed('nope', (r) => {
          firstCall = r;
        });
        t.isAllowed('val1', (r) => {
          should(firstCall).be.False;
          r.should.be.True;
          done();
        });
      });
  });
});
