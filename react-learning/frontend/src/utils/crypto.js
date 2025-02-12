import MD5 from 'crypto-js/md5';

/**
 * MD5加密
 * @param {string} text - 需要加密的文本
 * @returns {string} - 返回加密后的字符串
 */
export const md5 = (text) => {
  return MD5(text).toString();
}; 