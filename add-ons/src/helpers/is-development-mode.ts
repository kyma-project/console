export const isDevelopmentModeFlag = (
  value: string | boolean,
): boolean | null => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'boolean') {
    return value;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  }
  return false;
};
