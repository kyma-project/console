export const extractIsDevelopmentModeFlag = (
  value: string | boolean,
): boolean | null => {
  if (value) {
    return null;
  }

  if (typeof value === 'boolean') {
    return value;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  }
  return false;
};
