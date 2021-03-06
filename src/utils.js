import once from 'lodash.once';
import { getUserLocales } from 'get-user-locale';

/* eslint-disable import/prefer-default-export */

/**
 * Extends language codes if necessary. For example, given:
 *   ['en-US', 'pl']
 * will return:
 *   ['en-US', 'pl-PL']
 *
 * @param {String[]} arr Array of language codes
 */
function extendLanguageCodes(arr) {
  return arr.map(el => (
    el.includes('-') ? el : `${el}-${el.toUpperCase()}`
  ));
}

const getExtendedUserLocales = once(() => {
  const userLocales = getUserLocales();
  return extendLanguageCodes(userLocales);
});

/**
 * Finds a locale which both we support and user prefers.
 *
 * @param {String[]} supportedLocales Supported locales
 */
export const getMatchingLocale = once((supportedLocales) => {
  const extendedUserLocales = getExtendedUserLocales();
  const matchingLocale = extendedUserLocales.find(locale => supportedLocales.includes(locale));
  return matchingLocale;
});
