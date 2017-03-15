import should from 'should'; // eslint-disable-line no-unused-vars
import events from '../../../src/js/core/util/events';

describe('events', () => {
  let e;
  let e2;

  beforeEach(() => {
    e = events();
    e2 = events();
  });

  it('should trigger event listeners for event key', () => {
    const results = [];
    e.on('test', (event) => {
      results.push(event);
    });
    e.on('test', (event) => {
      results.push(event);
    });

    e.trigger('test', { file: 'one' });

    results.should.be.eql([
      { type: 'test', file: 'one' },
      { type: 'test', file: 'one' },
    ]);
  });

  it('should ignore event listener if listener is not a function', () => {
    e.on('test');
    e.on('test', 'something');
  });

  it('should trigger silently if no listeners registered for event', () => {
    e.trigger('doesnotexist', { file: 'two' });
  });

  it('should trigger event listeners in emitting events object', () => {
    e.emit(e2);

    const results = [];
    e.on('test', (event) => {
      results.push(event);
    });
    e2.on('test', (event) => {
      results.push(event);
    });

    e.trigger('test', { file: 'one' });

    results.should.be.eql([
      { type: 'test', file: 'one' },
      { type: 'test', file: 'one' },
    ]);
  });

  it('should trigger event listeners for global and specific when event is specific', () => {
    const results = [];
    e.on('test', (event) => {
      results.push([0, event]);
    });
    e.on('test', 1, (event) => {
      results.push([1, event]);
    });
    e.on('test', 2, (event) => {
      results.push([2, event]);
    });

    e.trigger('test', { id: '1', file: 'one' });

    results.should.be.eql([
      [1, { type: 'test', id: '1', file: 'one' }],
      [0, { type: 'test', id: '1', file: 'one' }],
    ]);
  });

  it('should trigger event listeners for global and specific when event is global', () => {
    const results = [];
    e.on('test', (event) => {
      results.push([0, event]);
    });
    e.on('test', 1, (event) => {
      results.push([1, event]);
    });
    e.on('test', 2, (event) => {
      results.push([2, event]);
    });

    e.trigger('test', { file: 'one' });

    results.should.be.eql([
      [1, { type: 'test', file: 'one' }],
      [2, { type: 'test', file: 'one' }],
      [0, { type: 'test', file: 'one' }],
    ]);
  });

  it('should not trigger events listeners that have stopped listening by id', () => {
    const results = [];
    e.on('test', (event) => {
      results.push([0, event]);
    });
    e.on('test', 1, (event) => {
      results.push([1, event]);
    });
    e.on('test', 1, (event) => {
      results.push([2, event]);
    });
    e.off('test', 1);

    e.trigger('test', { file: 'one' });

    results.should.be.eql([
      [0, { type: 'test', file: 'one' }],
    ]);
  });

  it('should not trigger events listeners that have stopped listening by handler', () => {
    const results = [];
    e.on('test', (event) => {
      results.push([0, event]);
    });
    e.on('test', 1, (event) => {
      results.push([1, event]);
    });
    const handler = (event) => {
      results.push([2, event]);
    };
    e.on('test', 1, handler);
    e.off('test', handler);

    e.trigger('test', { file: 'one' });

    results.should.be.eql([
      [1, { type: 'test', file: 'one' }],
      [0, { type: 'test', file: 'one' }],
    ]);
  });

  it('should not trigger events listeners that have stopped listening by handler and id',
    () => {
      const results = [];
      e.on('test', (event) => {
        results.push([0, event]);
      });
      e.on('test', 1, (event) => {
        results.push([1, event]);
      });
      const handler = (event) => {
        results.push([2, event]);
      };
      e.on('test', 1, handler);
      e.off('test', 2, handler);

      e.trigger('test', { file: 'one' });

      results.should.be.eql([
        [1, { type: 'test', file: 'one' }],
        [2, { type: 'test', file: 'one' }],
        [0, { type: 'test', file: 'one' }],
      ]);

      results.splice(0, results.length);

      e.off('test', 1, handler);

      e.trigger('test', { file: 'one' });

      results.should.be.eql([
        [1, { type: 'test', file: 'one' }],
        [0, { type: 'test', file: 'one' }],
      ]);
    });
});
