import React from 'react';

import SwaggerConsole from './SwaggerConsole.component';

import { ApiReferencePlugin } from './plugins';

const SwaggerApiReference = props => {
  return <SwaggerConsole plugins={[ApiReferencePlugin]} {...props} />;
};

export default SwaggerApiReference;
