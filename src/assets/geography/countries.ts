//   /** ISO 3166-1 A2 code. */
//   code: string;
//   /** ISO 3166-1 A3 code. */
//   triple_code: string;
//   /** ISO 3166-1 Numeric code. */
//   numeric_code: "number";
//   /** ISO 3166-2 subdivision codes link */
//   code_link: string;
//   /** Top level domain (TLD) */
//   domain: string;

import country_data from './country_data';
import country_paths from './country_paths';
import currencies from './currencies';

const nameRegex = /\(.+\)|\[.+\]/g;

type InferredCountry = (typeof country_data)[number];

export interface Currency {
  /** Name of currency. */
  currency: string;
  /** Symbol or abbreviation. */
  symbol: string;
  /** ISO three-letter code. */
  code: string;
  /** Possible name of fractional unit. */
  fractional_unit?: string;
}

export type CountryCode = Exclude<(typeof country_data)[number]['code'], ''>;
export type Country = Omit<Record<keyof InferredCountry, string>, 'code'> & {
  code: CountryCode;
  path: string;
  currencies: Currency[];
};

export const country_list: Country[] = country_data
  .filter((c) => {
    if (c.code === '') {
      return false;
    }
    return true;
  })
  .map<Country>((c) => {
    if (c.code === '') {
      throw new Error('Missing country code.');
    }
    const name = (c.name as string).replaceAll(nameRegex, '').trim();
    const country_currencies = currencies
      .filter(({ state }) => state === name)
      .map((currency) => ({
        code: currency.iso_code,
        currency: currency.currency,
        symbol: currency.symbol,
        fractional_unit: currency.fractional_unit || undefined,
      }));
    if (country_currencies.length === 0) {
      throw new Error('Missing currency for country: ' + name);
    }
    const country: Country = {
      ...(c as Country),
      name,
      official_name: (c.official_name as string)
        .replaceAll(nameRegex, '')
        .trim(),
      path: country_paths[c.code],
      currencies: country_currencies,
    };
    return country;
  });

export const country_by_code = country_list.reduce(
  (acc, c) => {
    acc[c.code] = c;
    return acc;
  },
  {} as Record<CountryCode, Country>,
);
