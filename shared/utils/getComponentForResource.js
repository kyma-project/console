import React from 'react';

export const getComponentFor = (
  PredefinedRenderersCollection,
  GenericRenderer,
) =>
  function renderComponent(name, params, defaultRenderer = GenericRenderer) {
    const Renderer = PredefinedRenderersCollection[name]
      ? PredefinedRenderersCollection[name](defaultRenderer)
      : defaultRenderer;

    return <Renderer {...params} />;
  };
