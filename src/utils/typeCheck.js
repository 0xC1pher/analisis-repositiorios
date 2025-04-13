const safeAccess = (object, path, defaultValue = null) => {
  return path.split('.').reduce((acc, key) => {
    try {
      return acc && acc[key] !== undefined ? acc[key] : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }, object);
};

const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const hasProperty = (object, property) => {
  return isObject(object) && property in object;
};

export { safeAccess, isObject, hasProperty };