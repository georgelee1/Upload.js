import { SimpleDOMParser, DOMList, Matcher } from '../../../src/js/core/util/dom';
import should from 'should';

global.document = {
  createElement(tagName) {
    return {
      children: [],
      tagName,
      appendChild(child) {
        this.children.push(child);
      },
      cloneNode() {
        return this;
      },
    };
  },
};

describe('Dom', () => {
  describe('Matcher', () => {
    describe('#test', () => {
      it('should return true if the type matcher passed', () => {
        const m = new Matcher().type('img');
        m.test({ tagName: 'img' }).should.be.True();
        m.test({ tagName: 'IMG' }).should.be.True();
        m.test({ tagName: 'div' }).should.be.False();
      });

      it('should return true if the css matcher passed', () => {
        const m = new Matcher().css('test');
        m.test({ className: 'test' }).should.be.True();
        m.test({ className: 'another test' }).should.be.True();
        m.test({}).should.be.False();
        m.test({ className: 'another' }).should.be.False();
      });

      it('should return true if matcher pass when bubbling', () => {
        const m = new Matcher(true).css('test');
        m.test({ className: 'another' }).should.be.False();
        m.test({ className: 'another', parentNode: { className: 'test' } }).should.be.True();
        m.test({
          className: 'another',
          parentNode: { className: 'different' },
        }).should.be.False();
        m.test({
          className: 'another',
          parentNode: {
            className: 'different',
            parentNode: { className: 'test' },
          },
        }).should.be.True();
      });
    });
  });

  describe('SimpleDOMParser', () => {
    describe('#parse', () => {
      it('should parse element', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div');
        result.should.be.DOMList;
        result.items.should.have.length(1);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(0);
        should(result.items[0].className).be.Undefined();
      });

      it('should parse element with class', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div.test');
        result.should.be.DOMList;
        result.items.should.have.length(1);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(0);
        result.items[0].className.should.be.exactly('test');
      });

      it('should parse element with multiple classes', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div.test.another');
        result.should.be.DOMList;
        result.items.should.have.length(1);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(0);
        result.items[0].className.should.be.exactly('test another');
      });

      it('should parse element with sibling', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div span');
        result.should.be.DOMList;
        result.items.should.have.length(2);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(0);
        should(result.items[0].className).be.Undefined();
        result.items[1].tagName.should.be.exactly('span');
        result.items[1].children.should.have.length(0);
        should(result.items[1].className).be.Undefined();
      });

      it('should parse element with children', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div (span)');
        result.should.be.DOMList;
        result.items.should.have.length(1);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(1);
        should(result.items[0].className).be.Undefined();
        result.items[0].children[0].tagName.should.be.exactly('span');
        result.items[0].children[0].children.should.have.length(0);
        should(result.items[0].children[0].className).be.Undefined();
      });

      it('should parse element with children that have class', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div (span.test)');
        result.should.be.DOMList;
        result.items.should.have.length(1);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(1);
        should(result.items[0].className).be.Undefined();
        result.items[0].children[0].tagName.should.be.exactly('span');
        result.items[0].children[0].children.should.have.length(0);
        result.items[0].children[0].className.should.be.exactly('test');
      });

      it('should parse element with children and sibling', () => {
        const parser = new SimpleDOMParser();
        const result = parser.parse('div (span.test) div.sibling');
        result.should.be.DOMList;
        result.items.should.have.length(2);
        result.items[0].tagName.should.be.exactly('div');
        result.items[0].children.should.have.length(1);
        should(result.items[0].className).be.Undefined();
        result.items[0].children[0].tagName.should.be.exactly('span');
        result.items[0].children[0].children.should.have.length(0);
        result.items[0].children[0].className.should.be.exactly('test');
        result.items[1].tagName.should.be.exactly('div');
        result.items[1].children.should.have.length(0);
        result.items[1].className.should.be.exactly('sibling');
      });
    });
  });

  describe('DOMList', () => {
    describe('#constructor', () => {
      it('should create a new element if supplied a string', () => {
        const ele = new DOMList('input');
        ele.items.should.have.length(1);
        ele.items[0].tagName.should.be.exactly('input');
      });

      it('should create an empty list if supplied undefined', () => {
        const e = undefined;
        const ele = new DOMList(e);
        ele.items.should.have.length(0);
      });

      it('should set the array passed as the list of elements', () => {
        const ele = new DOMList([{ name: 'test' }, { name: 'test2' }]);
        ele.items.should.have.length(2);
        ele.items[0].name.should.be.exactly('test');
        ele.items[1].name.should.be.exactly('test2');
      });

      it('should create a list if supplied with a single element', () => {
        const ele = new DOMList({ name: 'test' });
        ele.items.should.have.length(1);
        ele.items[0].name.should.be.exactly('test');
      });
    });

    describe('#clone', () => {
      class Ele {
        constructor(name = '') {
          this.name = name;
        }

        cloneNode(deep = false) {
          const cloned = new Ele(this.name);
          cloned.cloned = true;
          cloned.deep = deep;
          return cloned;
        }
      }

      it('should deeply clone all DOM elements', () => {
        const eles = [new Ele('test1'), new Ele('test2')];
        const list = new DOMList(eles);
        const cloned = list.clone();
        cloned.items.should.not.be.exactly(eles);
        cloned.items.should.have.length(2);
        cloned.items[0].name.should.be.exactly('test1');
        cloned.items[0].cloned.should.be.True();
        cloned.items[0].deep.should.be.True();
        cloned.items[1].name.should.be.exactly('test2');
        cloned.items[1].cloned.should.be.True();
        cloned.items[1].deep.should.be.True();
      });
    });

    describe('#appendTo', () => {
      class Ele {
        constructor() {
          this.children = [];
        }

        appendChild(ele) {
          this.children.push(ele);
        }
      }

      it('should append all DOM elements to parent element', () => {
        const parent = new Ele();
        const list = new DOMList([{ name: 'test1' }, { name: 'test2' }]);
        const returned = list.appendTo(parent);
        returned.should.be.exactly(list);
        parent.children.should.have.length(2);
        parent.children[0].should.be.eql({ name: 'test1' });
        parent.children[1].should.be.eql({ name: 'test2' });
      });
    });

    describe('#before', () => {
      class Ele {
        constructor() {
          this.children = [];
        }

        insertBefore(ele, ref) {
          const i = this.children.indexOf(ref);
          if (i >= 0) {
            this.children.splice(i, 0, ele);
          } else {
            this.children.push(ele);
          }
        }
      }

      it('should insert all DOM elements before the parent element', () => {
        const parent = new Ele();
        const ref = { parentNode: parent, name: 'previous' };
        parent.children.push(ref);

        const list = new DOMList([{ name: 'test1' }, { name: 'test2' }]);
        const returned = list.before(ref);
        returned.should.be.exactly(list);
        parent.children.should.have.length(3);
        parent.children[0].should.be.eql({ name: 'test1' });
        parent.children[1].should.be.eql({ name: 'test2' });
        parent.children[2].should.be.eql({ name: 'previous', parentNode: parent });
      });
    });

    describe('#remove', () => {
      class Ele {
        constructor(name, children = []) {
          this.name = name;
          this.children = children;
          this.children.forEach(c => {
            c.parentNode = this;
          });
        }

        removeChild(ele) {
          const i = this.children.indexOf(ele);
          if (i >= 0) {
            this.children.splice(i, 1);
          }
        }
      }

      it('should remove the element from it\'s parent ', () => {
        const child1 = new Ele('testChild1');
        const child2 = new Ele('testChild2');
        const parent = new Ele('testParent', [child1, child2]);
        const ele = new DOMList(child2);
        ele.remove().should.be.exactly(ele);
        parent.children.should.have.length(1);
        parent.children[0].name.should.be.exactly('testChild1');
      });
    });

    describe('#parent', () => {
      class Ele {
        constructor(className, children = []) {
          this.className = className;
          this.children = children;
          this.children.forEach(c => {
            c.parentNode = this;
          });
        }

        removeChild(ele) {
          const i = this.children.indexOf(ele);
          if (i >= 0) {
            this.children.splice(i, 1);
          }
        }
      }

      it('should return the direct parent when no matcher supplied', () => {
        const child = new Ele('testChild');
        const parent1 = new Ele('testParent1', [child]);
        const parent2 = new Ele('testParent2', [parent1]); // eslint-disable-line no-unused-vars
        const ele = new DOMList(child);
        const result = ele.parent();
        result.should.be.instanceof(DOMList);
        result.items[0].should.be.exactly(parent1);
      });

      it('should return the parent that matches the passed matcher', () => {
        const child = new Ele('testChild');
        const parent1 = new Ele('testParent1', [child]);
        const parent2 = new Ele('testParent2', [parent1]);
        const ele = new DOMList(child);
        const result = ele.parent(new Matcher().css('testParent2'));
        result.should.be.instanceof(DOMList);
        result.items[0].should.be.exactly(parent2);
      });

      it('should return undefined if not parent matches the passed matcher', () => {
        const child = new Ele('testChild');
        const parent1 = new Ele('testParent1', [child]);
        const parent2 = new Ele('testParent2', [parent1]); // eslint-disable-line no-unused-vars
        const ele = new DOMList(child);
        const result = ele.parent(new Matcher().css('test'));
        result.should.be.instanceof(DOMList);
        result.items.should.have.length(0);
      });
    });


    describe('#addClass', () => {
      it('should add class to element with no class', () => {
        const ele = new DOMList([{}]);
        ele.addClass('test');
        ele.items[0].className.should.be.exactly('test');
      });

      it('should add class to element with class', () => {
        const ele = new DOMList([{ className: 'other' }]);
        ele.addClass('test');
        ele.items[0].className.should.be.exactly('other test');
      });

      it('should not add class to element if that class already exists', () => {
        const ele = new DOMList([{ className: 'other test' }]);
        ele.addClass('test');
        ele.items[0].className.should.be.exactly('other test');
      });
    });

    describe('#removeClass', () => {
      it('should remove class from element if only class', () => {
        const ele = new DOMList([{ className: 'test' }]);
        ele.removeClass('test');
        ele.items[0].className.should.be.exactly('');
      });

      it('should remove class from element with other classes', () => {
        const ele = new DOMList([{ className: 'some thing test here' }]);
        ele.removeClass('test');
        ele.items[0].className.should.be.exactly('some thing here');
      });
    });

    describe('#css', () => {
      it('should add css style to element', () => {
        const ele = new DOMList([{ style: {} }]);
        ele.css('display', 'none');
        should(ele.items[0].style.display).be.exactly('none');
      });

      it('should add css styles to element', () => {
        const ele = new DOMList([{ style: {} }]);
        ele.css({
          display: 'none',
          width: '100%',
        });
        should(ele.items[0].style.display).be.exactly('none');
        should(ele.items[0].style.width).be.exactly('100%');
      });
    });

    describe('#attr', () => {
      class Ele {
        constructor(attrs = {}) {
          this._attrs = attrs;
        }

        setAttribute(key, val) {
          this._attrs[key] = val;
        }

        removeAttribute(key) {
          delete this._attrs[key];
        }

        getAttribute(key) {
          return this._attrs[key];
        }
      }

      it('should add attribute on element', () => {
        const ele = new DOMList([new Ele()]);
        ele.attr('test', 'val1');
        ele.items[0]._attrs.should.be.eql({ test: 'val1' });
      });

      it('should add attributes on element', () => {
        const ele = new DOMList([new Ele()]);
        ele.attr({ test: 'val1', test2: 'val2' });
        ele.items[0]._attrs.should.be.eql({ test: 'val1', test2: 'val2' });
      });

      it('should add and remove attributes on element', () => {
        const ele = new DOMList([new Ele({ test: 'val1', test2: 'val1' })]);
        ele.attr({ test: undefined, test2: 'val2' });
        ele.items[0]._attrs.should.be.eql({ test2: 'val2' });
      });

      it('should get attribute from element', () => {
        const ele = new DOMList([new Ele({ test: 'val1', test2: 'val2' })]);
        ele.attr('test2').should.be.exactly('val2');
      });
    });

    describe('#data', () => {
      class Ele {
        constructor(data = {}) {
          this.dataset = data;
        }
      }

      it('should add data attribute on element', () => {
        const ele = new DOMList([new Ele()]);
        ele.data('test', 'val1');
        ele.items[0].dataset.should.be.eql({ test: 'val1' });
      });

      it('should add data attributes on element', () => {
        const ele = new DOMList([new Ele()]);
        ele.data({ test: 'val1', test2: 'val2' });
        ele.items[0].dataset.should.be.eql({ test: 'val1', test2: 'val2' });
      });

      it('should data add and remove attributes on element', () => {
        const ele = new DOMList([new Ele({ test: 'val1', test2: 'val1' })]);
        ele.data({ test: undefined, test2: 'val2' });
        ele.items[0].dataset.should.be.eql({ test2: 'val2' });
      });

      it('should get data attribute fom element', () => {
        const ele = new DOMList([new Ele({ test: 'val1', test2: 'val2' })]);
        ele.data('test2').should.be.exactly('val2');
      });
    });

    describe('#on', () => {
      it('should fire the event for the matched target', () => {
        class Ele {
          addEventListener(event, funct) {
            const events = this._events = this._events || {};
            const functs = events[event] = events[event] || [];
            functs.push(funct);
          }

          trigger(event, target) {
            const events = (this._events || {})[event] || [];
            events.forEach(e => e({ target }));
          }
        }

        const ele = new DOMList([new Ele()]);
        let count = 0;
        ele.on('click', new Matcher().css('another'), () => {
          count++;
        });
        ele.items[0].trigger('click', { className: 'test' });
        count.should.be.exactly(0);
        ele.items[0].trigger('click', { className: 'anothera' });
        count.should.be.exactly(0);
        ele.items[0].trigger('click', { className: 'another' });
        count.should.be.exactly(1);
      });
    });

    describe('#find', () => {
      class Ele {
        constructor(children) {
          this.children = children;
        }

        querySelectorAll(selector) {
          const result = [];
          this.children.forEach(ele => {
            if (ele.tagName === selector) {
              result.push(ele);
            }
          });
          return result;
        }
      }

      it('should find all children elements', () => {
        const ele = new DOMList([
          new Ele([{ tagName: 'div' }, { tagName: 'div' }, { tagName: 'img' }]),
          new Ele([{ tagName: 'img' }, { tagName: 'div' }]),
        ]);
        let result = ele.find('div').items;
        result.should.have.length(3);
        result = ele.find('img').items;
        result.should.have.length(2);
      });
    });

    describe('#each', () => {
      it('should trigger the handler for each element', () => {
        const ele = new DOMList([{}, {}]).each(e => {
          e.reached = true;
        });
        ele.items[0].should.be.eql({ reached: true });
        ele.items[1].should.be.eql({ reached: true });
      });
    });
  });
});
