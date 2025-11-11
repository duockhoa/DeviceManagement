export const flattenObject = (obj) => {
    const result = {};

    const flatten = (object) => {
        Object.keys(object).forEach((key) => {
            if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                // If it's a nested object, merge its properties directly without prefix
                Object.assign(result, object[key]);
            } else {
                // If it's not a nested object, add it to result
                result[key] = object[key];
            }
        });
    };

    flatten(obj);
    return result;
};
