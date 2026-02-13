/**
 * Validation Module - Validações comuns
 * @module validation
 */

const validators = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhone: (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
  isURL: (url) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*\/?$/.test(url),
  minLength: (str, len) => str.length >= len,
  maxLength: (str, len) => str.length <= len
};

module.exports = validators;
