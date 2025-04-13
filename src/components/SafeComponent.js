import React from 'react';
import { safeAccess, isObject } from '../utils/typeCheck';

const SafeComponent = ({ data, children, fallback = null }) => {
  if (!isObject(data)) {
    console.warn('SafeComponent: Invalid data provided', data);
    return fallback;
  }

  try {
    return children(data);
  } catch (error) {
    console.error('SafeComponent render error:', error);
    return fallback;
  }
};

export default SafeComponent;