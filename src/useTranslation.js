import { useContext, useState, useEffect } from 'react';

import { Context } from './TProvider';

function getTranslatedString(string, languageFiles, locale) {
  return languageFiles[locale]()
    .then((languageFile) => {
      if (typeof languageFile[string] === 'string') {
        return languageFile[string];
      }

      return string;
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.error(`Unable to load locale: ${locale}`);
      return string;
    });
}

function translate(
  string,
  args,
  languageFiles,
  locale,
) {
  return getTranslatedString(string, languageFiles, locale).then((rawString) => {
    if (!args) {
      return rawString;
    }

    let finalString = rawString;
    Object.entries(args).forEach((entry) => {
      const key = entry[0];
      const value = entry[1];
      finalString = finalString.replace(`{${key}}`, value);
    });

    return finalString;
  });
}

export default function useTranslation(string, args = {}) {
  const { locale, defaultLocale, languageFiles } = useContext(Context);
  const [translatedString, setTranslatedString] = useState(null);

  useEffect(() => {
    if (locale === defaultLocale) {
      setTranslatedString(string);
    } else {
      translate(string, args, languageFiles, locale).then(setTranslatedString);
    }
  }, [string, ...Object.values(args), locale]);

  return translatedString;
}