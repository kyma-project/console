export function isPrimitive(type = null) {
  return (
    type === null || (typeof type !== 'function' && typeof type !== 'object')
  );
}
