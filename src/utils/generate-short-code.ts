import base62 from 'base62';

/**
 * 生成短链
 * @param {number} [length=6] 生成短链的长度，默认为 6
 * @returns {string} 返回生成的短链
 */
export const genShortCode = (length: number = 6) => {
  let shortLink = '';
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 62);
    shortLink += base62.encode(num);
  }
  return shortLink;
};
