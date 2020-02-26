/**
 * @file
 */

/**
 * Creates birthdate, birthYear and gender from CPR
 * @param cpr
 * @returns {{}}
 */
export function mapFromCpr(cpr) {
  const ret = {};
  if (isValidCpr(cpr)) {
    ret.birthDate = cpr.substr(0, 4);
    ret.birthYear = addMilenium(cpr.substr(4, 2), cpr.substr(6, 1));
    ret.gender = cpr.substr(9, 1) % 2 ? 'm' : 'f';
  }
  return ret;
}

/**
 *  Add milenium to 2 digit year as specified by https://da.wikipedia.org/wiki/CPR-nummer
 *
 * @param year - 2 digit year
 * @param seven - digit number 7 in the cpr
 */
export function addMilenium(year, seven) {
  switch (seven) {
    case '0':
    case '1':
    case '2':
    case '3':
      return '19' + year;
    case '4':
    case '9':
      return (year >= 37 ? '19' : '20') + year;
    case '5':
    case '6':
    case '7':
    case '8':
      return (year >= 58 ? '18' : '20') + year;
    default:
      return '??' + year;
  }
}
/**
 * Check for validity of a cpr
 *
 * @param cpr
 * @returns {boolean|Date|boolean}
 */
export function isValidCpr(cpr) {
  return isNumeric(cpr) && isValidDate(cpr) && cpr.length === 10;
}

/**
 *
 * @param n
 * @returns {boolean}
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Check if first 6 digits contains a valid date
 * @param ddmmyy
 * @returns {Date|boolean}
 */
export function isValidDate(ddmmyy) {
  const mm = ddmmyy.substr(2, 2) || '00';
  const d = new Date(ddmmyy.substr(4, 2), mm - 1, ddmmyy.substr(0, 2));
  return d && d.getMonth() + 1 === parseInt(mm, 10);
}
