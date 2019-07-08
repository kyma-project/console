import React from 'react';
import {
  RenderEngineProps,
  RenderEngine,
} from '@kyma-project/documentation-component';
import AsyncApi, {
  ThemeInterface,
  ConfigInterface,
} from '@kyma-project/asyncapi-react';
import { asyncApiTheme } from './theme';

const AsyncApiRenderEngine: React.FunctionComponent<RenderEngineProps> = ({
  source,
  options = {},
}) => (
  <AsyncApi
    schema={source.content ? source.content : source.rawContent}
    {...options}
  />
);

export const asyncApiRenderEngine: RenderEngine = {
  component: AsyncApiRenderEngine,
  sourceTypes: ['asyncapi', 'async-api', 'events'],
};

const asyncApiConfig = {
  disableDefaultTheme: true,
};

export const asyncApiOptions = {
  config: asyncApiConfig as ConfigInterface,
  theme: asyncApiTheme as ThemeInterface,
};
