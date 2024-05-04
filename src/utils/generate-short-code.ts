import * as base62 from 'base62';

/**
 * Generate short code
 * @param {number} [length=6] short code length，default is 6, max is 6
 * @returns {string} short code
 */
export const genShortCode = (length: number = 6) => {
  if (length > 6) throw new Error('length must be less than or equal to 6');

  let shortLink = '';
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 62);
    shortLink += base62.encode(num);
  }
  return shortLink;
};
