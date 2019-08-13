const CLASS_NAME_PREFIX = 'cms';

export const createElementClass = (element: string) =>
  element ? `${CLASS_NAME_PREFIX}__${element}` : '';
export const createModifierClass = (modifier: string, element?: string) =>
  modifier
    ? `${CLASS_NAME_PREFIX}${element ? `__${element}` : ''}--${modifier}`
    : '';
