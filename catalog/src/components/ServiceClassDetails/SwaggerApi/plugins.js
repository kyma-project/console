import React from 'react';
import { Models } from './SwaggerCustomComponents/Models';
import { ModelCollapse } from './SwaggerCustomComponents/ModelCollapse';
import { OperationTag } from './SwaggerCustomComponents/OperationTag';
import { SchemesWrapper } from './SwaggerCustomComponents/SchemesWrapper';

const plugin = {
  wrapComponents: {
    parameters: (Original, system) => props => {
      const customProps = { ...props, allowTryItOut: false };

      return <Original {...customProps} />;
    },
    authorizeBtn: () => () => null,
    authorizeOperationBtn: () => () => null,
    info: () => () => null,
    Col: SchemesWrapper,
    Models,
    ModelCollapse,
    OperationTag,
  },
};

export const ApiReferencePlugin = function(system) {
  return {
    ...plugin,
  };
};
