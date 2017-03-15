import should from 'should'; // eslint-disable-line no-unused-vars
import merge from '../../../src/js/core/util/merge';

describe('Merge', () => {
  it('Should merge multiple objects together correctly', () => {
    const obj1 = {
      test: {
        testA: {
          testAA: 'val1',
          testAB: 'val2',
        },
      },
    };
    const obj2 = {
      test: {
        testA: {
          testAA: 'val3',
          testAC: 'val4',
        },
        testB: {
          testBA: 'val5',
        },
      },
    };
    const obj3 = {
      test: {
        testB: {
          testBB: 'val6',
        },
      },
      test2: {
        test2A: 'val7',
      },
    };

    const result = merge({}, [obj1, obj2, obj3]);
    result.should.be.eql({
      test: {
        testA: {
          testAA: 'val3',
          testAB: 'val2',
          testAC: 'val4',
        },
        testB: {
          testBA: 'val5',
          testBB: 'val6',
        },
      },
      test2: {
        test2A: 'val7',
      },
    });
  });
});
