import should from 'should'; // eslint-disable-line no-unused-vars
import sinon from 'sinon';
import {
  children,
  addClass,
  removeClass,
  make,
  append,
  empty,
  attrs,
  on,
  set,
  data,
} from '../../../src/js/render/util/dom';

describe('Dom', () => {
  describe('#children', () => {
    it('Should return a list of all children when no type is defined', () => {
      const ele = {
        children: {
          length: 2,
          item(idx) {
            return {
              nodeName: 'DIV',
              id: idx,
            };
          },
        },
      };

      children(ele).should.be.eql(
        [
          { nodeName: 'DIV', id: 0 },
          { nodeName: 'DIV', id: 1 },
        ]
      );
    });

    it('Should return a list of all children of the type defined', () => {
      const ele = {
        children: {
          length: 5,
          item(idx) {
            return {
              nodeName: idx % 2 === 0 ? 'DIV' : 'SPAN',
              id: idx,
            };
          },
        },
      };

      children(ele, 'div').should.be.eql(
        [
          { nodeName: 'DIV', id: 0 },
          { nodeName: 'DIV', id: 2 },
          { nodeName: 'DIV', id: 4 },
        ]
      );
    });
  });

  describe('#addClass', () => {
    it('Should add classes to the element when no element has no classes', () => {
      const ele = {};
      addClass(ele, 'test', 'test2');
      ele.should.be.eql({
        className: 'test test2',
      });
    });

    it('Should add classes to the element when no element already has classes', () => {
      const ele = {
        className: 'before',
      };
      addClass(ele, 'test', 'test2');
      ele.should.be.eql({
        className: 'before test test2',
      });
    });

    it('Should add classes to the element, but not duplicate defined or currently set', () => {
      const ele = {
        className: 'test test2',
      };
      addClass(ele, 'test', 'test3', 'test3');
      ele.should.be.eql({
        className: 'test test2 test3',
      });
    });
  });

  describe('#removeClass', () => {
    it('Should remove class from the element', () => {
      const ele = {
        className: 'test test2',
      };
      removeClass(ele, 'test');
      ele.should.be.eql({
        className: 'test2',
      });
    });

    it('Should remove multiple classes from the element', () => {
      const ele = {
        className: 'test test2',
      };
      removeClass(ele, 'test', 'test2');
      ele.should.be.eql({
        className: '',
      });
    });

    it('Should ignore the remove if the class does not exist on the element', () => {
      const ele = {
        className: 'test test2',
      };
      removeClass(ele, 'test3');
      ele.should.be.eql({
        className: 'test test2',
      });
    });
  });

  describe('#make', () => {
    before(() => {
      global.document = {
        createElement(name) {
          return {
            nodeName: name.toUpperCase(),
            setAttribute: sinon.spy(),
          };
        },
      };
    });

    it('Should create a new element and not set any additional attributes', () => {
      const ele = make('div');
      ele.nodeName.should.be.equal('DIV');
      ele.setAttribute.callCount.should.be.equal(0);
    });

    it('Should create a new element and set attributes', () => {
      const ele = make('div', {
        src: 'test',
        class: 'testCls otherCls',
      });
      ele.nodeName.should.be.equal('DIV');
      ele.setAttribute.calledOnce.should.be.True();
      ele.className.should.be.equal('testCls otherCls');
    });
  });

  describe('#append', () => {
    it('Should append all the children to the element', () => {
      const ele = {
        appendChild: sinon.spy(),
      };
      append(ele, 'one', 'two');
      ele.appendChild.calledTwice.should.be.True();
      ele.appendChild.firstCall.args.should.be.eql(['one']);
      ele.appendChild.secondCall.args.should.be.eql(['two']);
    });
  });

  describe('#empty', () => {
    it('Should remove all children of the element', () => {
      const childList = ['one', 'one', 'two', 'two', 'three', 'three'];
      const ele = {
        get firstChild() {
          return childList.shift();
        },
        removeChild: sinon.spy(),
      };
      empty(ele);
      ele.removeChild.callCount.should.be.equal(3);
      ele.removeChild.firstCall.args.should.be.eql(['one']);
      ele.removeChild.secondCall.args.should.be.eql(['two']);
      ele.removeChild.thirdCall.args.should.be.eql(['three']);
    });
  });

  describe('#attrs', () => {
    it('Should get all attributes from the element', () => {
      const ele = {
        getAttribute(name) {
          return ({
            test: 'one',
            test2: 'two',
            test3: 'three',
          })[name];
        },
      };
      const result = attrs(ele, 'test', 'test2', 'test4');
      result.should.be.eql({
        test: 'one',
        test2: 'two',
        test4: undefined,
      });
    });
  });

  describe('#on', () => {
    it('Should call the add event listener for the event and handler', () => {
      const ele = {
        addEventListener: sinon.spy(),
      };
      const handler = () => {};
      on(ele, 'click', handler);
      ele.addEventListener.calledOnce.should.be.True();
      ele.addEventListener.firstCall.args[0].should.be.equal('click');
      ele.addEventListener.firstCall.args[1].should.be.equal(handler);
    });
  });

  describe('#set', () => {
    it('Should set the value on the object', () => {
      const obj = {
        test: {},
      };
      set(obj, 'test.test2.test3', 'val1');
      obj.should.be.eql({
        test: {
          test2: {
            test3: 'val1',
          },
        },
      });
    });
  });

  describe('#data', () => {
    it('Should obtain the data attributes from the element where the prefix is not defined', () => {
      const ele = {
        dataset: {
          test: 'val',
          test2: 'val2',
        },
      };
      const result = data(ele);
      result.should.be.eql({
        test: 'val',
        test2: 'val2',
      });
    });

    it('Should obtain the data attributes from the element where the prefix is defined', () => {
      const ele = {
        dataset: {
          testAttr: 'val',
          otherKey: 'val2',
          testAttr2: 'val3',
        },
      };
      const result = data(ele, 'test');
      result.should.be.eql({
        attr: 'val',
        attr2: 'val3',
      });
    });

    it('Should obtain the data attributes from the element where the prefix is defined as is ' +
      'the shape',
      () => {
        const ele = {
          dataset: {
            testAttr: 'val',
            otherKey: 'val2',
            testOtherKey1: 'val3',
            testOtherKey2: 'val4',
          },
        };
        const result = data(ele, 'test', {
          attr: 'test.url',
          other: 'test.other',
        });
        result.should.be.eql({
          test: {
            url: 'val',
            other: {
              key1: 'val3',
              key2: 'val4',
            },
          },
        });
      });
  });
});
