import React from 'react';
import {
  ModelsExtended,
  ModelCollapseExtended,
  OperationTagExtended,
  SchemesWrapperExtended,
} from './components';

const plugin = {
  wrapComponents: {
    parameters: (Original: typeof React.Component, system: any) => (
      props: any,
    ) => {
      const customProps = { ...props, allowTryItOut: false };
      return <Original {...customProps} />;
    },
    authorizeBtn: () => () => null,
    authorizeOperationBtn: () => () => null,
    info: () => () => null,
    Col: SchemesWrapperExtended,
    Models: ModelsExtended,
    ModelCollapse: ModelCollapseExtended,
    OperationTag: OperationTagExtended,
  },
};

export const ApiConsolePlugin = (system: any) => ({
  ...plugin,
});
