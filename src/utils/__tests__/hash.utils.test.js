import {assert} from 'chai';

import {createHash, validateHash} from '../hash.utils.js';

describe('test hashing', () => {
  let hash1;
  let hash2;
  it('should create a hash from a string', () => {
    hash1 = createHash('some text');
    assert.isString(hash1);
  });

  it('should create a different hash from a different string', () => {
    hash2 = createHash('some other text');
    assert.isString(hash2);
    assert.notEqual(hash1, hash2);
  });

  it('should create a hash from a number', () => {
    hash1 = createHash(1234);
    assert.isString(hash1);
  });

  it('should create identical hash from identical string', () => {
    hash2 = createHash('1234');
    assert.isString(hash2);
    assert.equal(hash1, hash2);
  });

  it('should validate a hash identical to the string which generated the hash', () => {
    const string = 'qwertyasdfgh';
    hash1 = createHash(string);
    assert.isTrue(validateHash(hash1, string));
  });

  it('should not validate a hash identical to the another string', () => {
    const anotherString = 'QWERTYASDFGH';
    assert.isFalse(validateHash(hash1, anotherString));
  });

  it('should throw an exception for none scalar type: object', () => {
    try {
      hash1 = createHash({});
    }
    catch (e) {
      assert.equal(e.message, 'Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: boolean', () => {
    try {
      hash1 = createHash(true);
    }
    catch (e) {
      assert.equal(e.message, 'Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: array', () => {
    try {
      hash1 = createHash([]);
    }
    catch (e) {
      assert.equal(e.message, 'Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: null', () => {
    try {
      hash1 = createHash(null);
    }
    catch (e) {
      assert.equal(e.message, 'Wrong type for createHash function');
    }
  });
});

