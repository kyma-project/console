//TODO: move this component to a shared "place"
class CustomPropTypes {
  static elementRef = (props, propName, componentName) =>
    props[propName] && props[propName].current !== undefined
      ? null
      : new Error(
          'Invalid prop `' +
            propName +
            '` supplied to' +
            ' `' +
            componentName +
            '`. Validation failed.',
        );

  static oneOfProps = (props, componentName, propsToLookFor = []) => {
    if (!propsToLookFor.some(propName => props[propName])) {
      return new Error(
        `One of props [${propsToLookFor.join(
          ', ',
        )}] was not specified in '${componentName}'.`,
      );
    }
  };
}

export default CustomPropTypes;
