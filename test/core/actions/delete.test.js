import should from 'should'; // eslint-disable-line no-unused-vars
import sinon from 'sinon';
import del from '../../../src/js/core/actions/delete';
import options from '../../../src/js/core/util/options';
import events from '../../../src/js/core/util/events';
import queue from '../../../src/js/core/util/queue';

describe('fileDelete', () => {
  let opts;
  let http;
  let ev;
  let dele;

  beforeEach(() => {
    opts = options({
      allowed_types: ['jpeg'],
      delete: {
        url: '/delete',
        param: 'file',
        additionalParams: {
          test: 'val1',
        },
        headers: {
          header1: 'val2',
        },
      },
    });

    http = sinon.stub();

    ev = events();

    dele = del(http, ev, opts, queue((item, done) => {
      item(done);
    }, { delay: 0 }));
  });

  it('When deleting a file and it is successful it should call the success listener', (done) => {
    const mockHttp = {};
    mockHttp.progress = sinon.stub().returns(mockHttp);
    mockHttp.done = sinon.stub().returns(mockHttp);
    mockHttp.fail = sinon.stub().returns(mockHttp);

    http.returns(mockHttp);

    const mockListener = sinon.spy();
    ev.on('delete.added', 111, mockListener);
    ev.on('delete.started', 111, mockListener);
    ev.on('delete.fail', 111, mockListener);
    ev.on('delete.done', 111, (event) => {
      event.should.be.eql({
        type: 'delete.done',
        id: 111,
      });

      mockListener.callCount.should.be.equal(2);

      done();
    });

    dele.del(111);

    mockListener.calledTwice.should.be.True();
    mockListener.firstCall.args.should.be.eql([{
      type: 'delete.added',
      id: 111,
    }]);
    mockListener.secondCall.args.should.be.eql([{
      type: 'delete.started',
      id: 111,
    }]);

    setTimeout(() => {
      mockHttp.done.callArgWith(0, { success: true });
    }, 10);
  });

  it('When deleting a file and it fails because success flag is false it should call the fail ' +
    'listener',
    (done) => {
      const mockHttp = {};
      mockHttp.progress = sinon.stub().returns(mockHttp);
      mockHttp.done = sinon.stub().returns(mockHttp);
      mockHttp.fail = sinon.stub().returns(mockHttp);

      http.returns(mockHttp);

      const mockListener = sinon.spy();
      ev.on('delete.added', 333, mockListener);
      ev.on('delete.started', 333, mockListener);
      ev.on('delete.done', 333, mockListener);
      ev.on('delete.failed', 333, (event) => {
        event.should.be.eql({
          type: 'delete.failed',
          id: 333,
        });

        mockListener.callCount.should.be.equal(2);

        done();
      });

      dele.del(333);

      mockListener.calledTwice.should.be.True();
      mockListener.firstCall.args.should.be.eql([{
        type: 'delete.added',
        id: 333,
      }]);
      mockListener.secondCall.args.should.be.eql([{
        type: 'delete.started',
        id: 333,
      }]);

      setTimeout(() => {
        mockHttp.fail.callArgWith(0);
      }, 10);
    });

  it('When deleting a file and it fails it should call the fail listener', (done) => {
    const mockHttp = {};
    mockHttp.progress = sinon.stub().returns(mockHttp);
    mockHttp.done = sinon.stub().returns(mockHttp);
    mockHttp.fail = sinon.stub().returns(mockHttp);

    http.returns(mockHttp);

    const mockListener = sinon.spy();
    ev.on('delete.added', 444, mockListener);
    ev.on('delete.started', 444, mockListener);
    ev.on('delete.done', 444, mockListener);
    ev.on('delete.failed', 444, (event) => {
      event.should.be.eql({
        type: 'delete.failed',
        id: 444,
      });

      mockListener.callCount.should.be.equal(2);

      done();
    });

    dele.del(444);

    mockListener.calledTwice.should.be.True();
    mockListener.firstCall.args.should.be.eql([{
      type: 'delete.added',
      id: 444,
    }]);
    mockListener.secondCall.args.should.be.eql([{
      type: 'delete.started',
      id: 444,
    }]);

    setTimeout(() => {
      mockHttp.fail.callArgWith(0);
    }, 10);
  });
});
