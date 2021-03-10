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
  function renderComponent({
    name,
    params,
    nameForCreate,
    defaultRenderer = GenericRenderer,
  }) {
    const predefined = findByName(PredefinedRenderersCollection, name);
    const Renderer = predefined ? predefined(defaultRenderer) : defaultRenderer;
    const CreateFormRenderer = nameForCreate
      ? findByName(PredefinedRenderersCollection, nameForCreate) || null
      : null;

    return <Renderer createResourceForm={CreateFormRenderer} {...params} />;
  };
