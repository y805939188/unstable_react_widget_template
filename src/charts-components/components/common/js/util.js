const util = {
    isNil: value => value == null,

    isStr: value => typeof value === 'string',

    isNumber: value => typeof value === 'number',

    isArray: value => Array.isArray(value),
};

export default util;
