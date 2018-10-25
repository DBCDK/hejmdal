import {createHash, validateHash, encrypt, decrypt} from '../hash.utils.js';

describe('test hashing', () => {
  let hash1;
  let hash2;
  it('should insert a hash from a string', () => {
    hash1 = createHash('some text');
    expect(typeof hash1).toBe('string');
  });

  it('should insert a different hash from a different string', () => {
    hash2 = createHash('some other text');
    expect(typeof hash2).toBe('string');
    expect(hash1).not.toEqual(hash2);
  });

  it('should insert a hash from a number', () => {
    hash1 = createHash(1234);
    expect(typeof hash1).toBe('string');
  });

  it('should insert identical hash from identical string', () => {
    hash2 = createHash('1234');
    expect(typeof hash2).toBe('string');
    expect(hash1).toEqual(hash2);
  });

  it('should validate a hash identical to the string which generated the hash', () => {
    const string = 'qwertyasdfgh';
    hash1 = createHash(string);
    expect(validateHash(hash1, string)).toBe(true);
  });

  it('should not validate a hash identical to the another string', () => {
    const anotherString = 'QWERTYASDFGH';
    expect(validateHash(hash1, anotherString)).toBe(false);
  });

  it('should throw an exception for none scalar type: object', () => {
    try {
      hash1 = createHash({});
    } catch (e) {
      expect(e.message).toEqual('Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: boolean', () => {
    try {
      hash1 = createHash(true);
    } catch (e) {
      expect(e.message).toEqual('Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: array', () => {
    try {
      hash1 = createHash([]);
    } catch (e) {
      expect(e.message).toEqual('Wrong type for createHash function');
    }
  });

  it('should throw an exception for none scalar type: null', () => {
    try {
      hash1 = createHash(null);
    } catch (e) {
      expect(e.message).toEqual('Wrong type for createHash function');
    }
  });
});

describe('test encryption', () => {
  it('should encrypt and decrypt object', () => {
    const obj = {somekey: 'some value'};
    const encrypted = encrypt(obj);
    const decrypted = decrypt(encrypted);
    expect(obj).toEqual(decrypted);
  });

  it('encrypting the same object twice should lead to different hexString, due to initialization vector', () => {
    const obj = {somekey: 'some value'};
    expect(encrypt(obj).hex).not.toEqual(encrypt(obj).hex);
  });
});
