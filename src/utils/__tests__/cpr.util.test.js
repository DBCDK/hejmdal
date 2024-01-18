import {isNumeric, isValidCpr, isValidDate, trimPossibleCpr} from '../cpr.util';

describe('test cpr method', () => {
  it('Should be valid cpr', () => {
    expect(isValidCpr('010101010')).toBeFalsy();
    expect(isValidCpr('01010101011')).toBeFalsy();
    expect(isValidCpr('0113010101')).toBeFalsy();
    expect(isValidCpr('0001010101')).toBeFalsy();
    expect(isValidCpr('0101010101')).toBeTruthy();
  });

  it('Should be numeric', () => {
    expect(isNumeric('a123')).toBeFalsy();
    expect(isNumeric('123a')).toBeFalsy();
    expect(isNumeric('12a3')).toBeFalsy();
    expect(isNumeric('0')).toBeTruthy();
    expect(isNumeric('123')).toBeTruthy();
  });

  it('Should check valid date', () => {
    expect(isValidDate('320124')).toBeFalsy();
    expect(isValidDate('310424')).toBeFalsy();
    expect(isValidDate('300224')).toBeFalsy();
    expect(isValidDate('290223')).toBeFalsy();
    expect(isValidDate('290224')).toBeTruthy();
  });

  it('Should normalize cpr with -', () => {
    expect(trimPossibleCpr('123456-1234')).toEqual('123456-1234');
    expect(trimPossibleCpr('121212-123')).toEqual('121212-123');
    expect(trimPossibleCpr('121212-1234')).toEqual('1212121234');
    expect(trimPossibleCpr('12 12 12-1234')).toEqual('1212121234');
  });
});
