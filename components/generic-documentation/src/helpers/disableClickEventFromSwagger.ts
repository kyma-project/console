export function disableClickEventFromSwagger() {
  const beginOfSwaggerClickFunctionAsString = `for (var t = e.target; t && "A" !== t.tagName;)`;

  const originalEventListener = window.addEventListener;
  window.addEventListener = (
    type: string,
    fn: (...args: any[]) => any,
    options: any,
  ) => {
    if (type === 'click') {
      const fnAsString = fn.toString();
      if (fnAsString.includes(beginOfSwaggerClickFunctionAsString)) {
        return;
      }
    }
    return originalEventListener(type, fn, options);
  };
}
