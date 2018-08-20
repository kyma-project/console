import React from 'react';

import SwaggerConsole from './SwaggerConsole.component';

import { ApiConsolePlugin } from './plugins';

const SwaggerApiConsole = props => {
  return <SwaggerConsole plugins={[ApiConsolePlugin]} {...props} />;
};

export default SwaggerApiConsole;
