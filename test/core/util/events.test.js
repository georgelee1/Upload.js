import events from '../../../src/js/core/util/events';
import should from 'should'; // eslint-disable-line no-unused-vars

describe('events', () => {
  let e;

  before(() => {
    e = events();
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
});
