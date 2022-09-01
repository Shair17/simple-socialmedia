export const isArray = Array.isArray;

export const isMap = (val: unknown) => toTypeString(val) === '[object Map]';

export const isSet = (val: unknown) => toTypeString(val) === '[object Set]';

export const isDate = (val: unknown) => toTypeString(val) === '[object Date]';

export const isFunction = (val: unknown) => typeof val === 'function';

export const isString = (val: unknown) => typeof val === 'string';

export const isSymbol = (val: unknown) => typeof val === 'symbol';

export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object';

export const isPromise = (val: any) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

const objectToString = Object.prototype.toString;

const toTypeString = (value: any) => objectToString.call(value);

export const isPlainObject = (val: any) =>
  toTypeString(val) === '[object Object]';

const isIntegerKey = (key: any) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key;

const hasChanged = (value: any, oldValue: any) => !Object.is(value, oldValue);

const toNumber = (val: string) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
