import React from 'react';
import { Models } from './SwaggerCustomComponents/Models';
import { ModelCollapse } from './SwaggerCustomComponents/ModelCollapse';
import { OperationTag } from './SwaggerCustomComponents/OperationTag';
import { SchemesWrapper } from './SwaggerCustomComponents/SchemesWrapper';

const plugin = {
  wrapComponents: {
    parameters: (Original, system) => props => {
      const allowTryItOut = false;
      const customProps = { ...props, allowTryItOut };

      return <Original {...customProps} />;
    },
    authorizeBtn: (Original, system) => props => {
      return null;
    },
    authorizeOperationBtn: (Original, system) => props => {
      return null;
    },
    info: (Original, system) => props => {
      return null;
    },
    Col: SchemesWrapper,
    Models: Models,
    ModelCollapse,
    OperationTag,
  },
};

export const ApiReferencePlugin = function(system) {
  return {
    ...plugin,
  };
};

export const ApiConsolePlugin = function(system) {
  return {
    ...plugin,
  };
};
