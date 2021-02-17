import React from 'react';

function findByName(object, propertyName) {
  return object[
    Object.keys(object).find(
      k => k.toLowerCase() === propertyName.toLowerCase(),
    )
  ];
}

export const getComponentFor = (
  PredefinedRenderersCollection,
  GenericRenderer,
) =>
  function renderComponent(name, params, defaultRenderer = GenericRenderer) {
    const predefined = findByName(PredefinedRenderersCollection, name);
    const Renderer = predefined ? predefined(defaultRenderer) : defaultRenderer;

    return <Renderer {...params} />;
  };
