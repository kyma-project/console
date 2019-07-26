export class CustomPropTypes {
  static elementRef = (props, propName, componentName) =>
    props[propName].current !== undefined
      ? null
      : new Error(
          'Invalid prop `' +
            propName +
            '` supplied to' +
            ' `' +
            componentName +
            '`. Validation failed.',
        );
}
