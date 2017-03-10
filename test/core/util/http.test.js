import should from 'should';
import http from '../../../src/js/core/util/http';

export function run() {
  let data = undefined;
  let request = {
    headers: {},
  };

  global.FormData = class FormData {
    constructor() {
      this.params = {};
    }

    append(key, val, name) {
      const p = this.params[key] || [];
      p.push({
        val,
        name,
      });
      this.params[key] = p;
    }
  };

  global.XMLHttpRequest = class XMLHttpRequest {
    constructor() {
      this.upload = {
        addEventListener(name, func) {
          if (name === 'progress') {
            global._XMLHttpRequest_event = func;
          }
        },
      };
      global._current_XMLHttpRequest = this;
    }

    open(method, url, async) {
      request.method = method;
      request.url = url;
      request.async = async;
    }

    setRequestHeader(name, val) {
      request.headers[name] = val;
    }

    send(formData) {
      data = formData;
    }
  };

  describe('Http', () => {
    beforeEach(() => {
      data = undefined;
      request = {
        headers: {},
      };
    });

    it('parameters are set correctly for object map', () => {
      http('/test', {
        param1: 'val1',
        param2: 'val2',
        param3: ['val3', 'val4'],
      });
      should(data.params.param1[0].val).be.exactly('val1');
      should(data.params.param2[0].val).be.exactly('val2');
      should(data.params.param3[0].val).be.exactly('val3');
      should(data.params.param3[1].val).be.exactly('val4');

      should(request.method).be.exactly('POST');
      should(request.url).be.exactly('/test');
      should(request.async).be.True();
      should(request.headers['Content-Type']).be.Undefined();
    });

    it('parameters are set correctly for file map', () => {
      http('/test', {
        param1: {
          type: 'image/jpg',
          name: 'file1.jpg',
        },
        param2: [{
          type: 'image/png',
          name: 'file2.png',
        }, {
          type: 'image/gif',
          name: 'file3.gif',
        }],
      });
      should(data.params.param1[0].val).be.eql({ type: 'image/jpg', name: 'file1.jpg' });
      should(data.params.param2[0].val).be.eql({ type: 'image/png', name: 'file2.png' });
      should(data.params.param2[1].val).be.eql({ type: 'image/gif', name: 'file3.gif' });

      should(request.method).be.exactly('POST');
      should(request.url).be.exactly('/test');
      should(request.async).be.True();
      should(request.headers['Content-Type']).be.Undefined();
    });

    it('headers are set correctly', () => {
      http('/test', {
        param1: 'test',
      }, {
        'X-HEADER': 'testHeader1',
        OTHER: 'testHeader2',
      });

      should(request.headers['X-HEADER']).be.exactly('testHeader1');
      should(request.headers.OTHER).be.exactly('testHeader2');
    });

    it('should trigger done handler on success', () => {
      let called = false;
      let times = 0;
      http('/text').done(() => {
        called = 'done';
        times++;
      }).fail(() => {
        called = 'fail';
        times++;
      });
      should(global._current_XMLHttpRequest.onreadystatechange).be.a.Function();
      global._current_XMLHttpRequest.readyState = 4;
      global._current_XMLHttpRequest.status = 200;
      global._current_XMLHttpRequest.response = '{\'success\':true}';
      global._current_XMLHttpRequest.onreadystatechange();
      called.should.be.exactly('done');
      times.should.be.exactly(1);
    });

    it('should trigger fail handler on success but response parse error', () => {
      let called = false;
      let times = 0;
      http('/text').done(() => {
        called = 'done';
        times++;
      }).fail(() => {
        called = 'fail';
        times++;
      });
      should(global._current_XMLHttpRequest.onreadystatechange).be.a.Function();
      global._current_XMLHttpRequest.readyState = 4;
      global._current_XMLHttpRequest.status = 200;
      global._current_XMLHttpRequest.response = '{success:true';
      global._current_XMLHttpRequest.onreadystatechange();
      called.should.be.exactly('fail');
      times.should.be.exactly(1);
    });

    it('should trigger fail handler on unsuccessful response', () => {
      let called = false;
      let times = 0;
      http('/text').done(() => {
        called = 'done';
        times++;
      }).fail(() => {
        called = 'fail';
        times++;
      });
      should(global._current_XMLHttpRequest.onreadystatechange).be.a.Function();
      global._current_XMLHttpRequest.readyState = 4;
      global._current_XMLHttpRequest.status = 404;
      global._current_XMLHttpRequest.onreadystatechange();
      called.should.be.exactly('fail');
      times.should.be.exactly(1);
    });

    it('should trigger progress handler on upload progress update', () => {
      let called = false;
      let times = 0;
      let progress = 0;
      http('/text').done(() => {
        called = 'done';
        times++;
      }).fail(() => {
        called = 'fail';
        times++;
      }).progress(e => { progress = e; });
      should(global._XMLHttpRequest_event).be.a.Function();
      called.should.be.False();
      times.should.be.exactly(0);

      global._XMLHttpRequest_event({ loaded: 40, total: 200 });
      progress.should.be.exactly(20);

      global._XMLHttpRequest_event({ loaded: 1145, total: 6678 });
      progress.should.be.exactly(18);

      global._XMLHttpRequest_event({ loaded: 3512, total: 3973 });
      progress.should.be.exactly(89);
    });
  });
}
