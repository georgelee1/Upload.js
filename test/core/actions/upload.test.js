import should from 'should'; // eslint-disable-line no-unused-vars
import sinon from 'sinon';
import upload from '../../../src/js/core/actions/upload';
import options from '../../../src/js/core/util/options';
import events from '../../../src/js/core/util/events';
import queue from '../../../src/js/core/util/queue';

describe('fileUpload', () => {
  let opts;
  let http;
  let ev;
  let up;

  beforeEach(() => {
    opts = options({
      allowed_types: ['jpeg'],
      upload: {
        url: '/upload',
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

    up = upload(http, ev, opts, queue((item, done) => {
      item(done);
    }, { delay: 0 }));
  });

  it('When uploading a file and it is successful it should call the success listener', (done) => {
    const mockHttp = {};
    mockHttp.progress = sinon.stub().returns(mockHttp);
    mockHttp.done = sinon.stub().returns(mockHttp);
    mockHttp.fail = sinon.stub().returns(mockHttp);

    http.returns(mockHttp);

    const file = {
      type: 'jpeg',
    };

    const mockListener = sinon.spy();
    ev.on('upload.started', mockListener);
    ev.on('upload.rejected', mockListener);
    ev.on('upload.progress', mockListener);
    ev.on('upload.fail', mockListener);
    ev.on('upload.done', (event) => {
      event.should.be.eql({
        type: 'upload.done',
        file,
        id: '111',
      });

      mockListener.callCount.should.be.equal(4);
      mockListener.getCall(1).args.should.be.eql([{
        type: 'upload.progress',
        file,
        progress: 10,
      }]);
      mockListener.getCall(2).args.should.be.eql([{
        type: 'upload.progress',
        file,
        progress: 60,
      }]);
      mockListener.getCall(3).args.should.be.eql([{
        type: 'upload.progress',
        file,
        progress: 100,
      }]);

      done();
    });

    up.upload(file);

    mockListener.calledOnce.should.be.True();
    mockListener.firstCall.args.should.be.eql([{
      type: 'upload.started',
      file,
    }]);

    setTimeout(() => {
      mockHttp.progress.callArgWith(0, 10);
      mockHttp.progress.callArgWith(0, 60);
      mockHttp.progress.callArgWith(0, 100);
      mockHttp.done.callArgWith(0, { uploadImageId: '111' });
    }, 10);
  });

  it('When uploading a file and it fails it should call the fail listener', (done) => {
    const mockHttp = {};
    mockHttp.progress = sinon.stub().returns(mockHttp);
    mockHttp.done = sinon.stub().returns(mockHttp);
    mockHttp.fail = sinon.stub().returns(mockHttp);

    http.returns(mockHttp);

    const file = {
      type: 'jpeg',
    };

    const mockListener = sinon.spy();
    ev.on('upload.started', mockListener);
    ev.on('upload.rejected', mockListener);
    ev.on('upload.progress', mockListener);
    ev.on('upload.done', mockListener);
    ev.on('upload.failed', (event) => {
      event.should.be.eql({
        type: 'upload.failed',
        file,
      });

      mockListener.callCount.should.be.equal(2);
      mockListener.getCall(1).args.should.be.eql([{
        type: 'upload.progress',
        file,
        progress: 10,
      }]);

      done();
    });

    up.upload(file);

    mockListener.calledOnce.should.be.True();
    mockListener.firstCall.args.should.be.eql([{
      type: 'upload.started',
      file,
    }]);

    setTimeout(() => {
      mockHttp.progress.callArgWith(0, 10);
      mockHttp.fail.callArgWith(0);
    }, 10);
  });

  it('When uploading a file that is not an allowed type it is rejected', () => {
    const file = {
      type: 'png',
    };

    const mockListener = sinon.spy();
    ev.on('upload.started', mockListener);
    ev.on('upload.rejected', mockListener);
    ev.on('upload.progress', mockListener);
    ev.on('upload.done', mockListener);
    ev.on('upload.failed', mockListener);

    up.upload(file);

    mockListener.calledOnce.should.be.True();
    mockListener.firstCall.args.should.be.eql([{
      type: 'upload.rejected',
      file,
      rejected: 'type',
    }]);

    http.callCount.should.be.equal(0);
  });
});
