import { RenderEngineWithOptions } from '@kyma-project/documentation-component';
import {
  asyncApiRenderEngine,
  AsyncApiProps,
  ConfigInterface,
} from '@kyma-project/dc-async-api-render-engine';
import { asyncApiTheme } from './theme';

const asyncApiConfig = {
  disableDefaultTheme: true,
};

const asyncApiOptions = {
  config: asyncApiConfig as ConfigInterface,
  theme: asyncApiTheme,
};

export const asyncApiRE: RenderEngineWithOptions<AsyncApiProps> = {
  renderEngine: asyncApiRenderEngine,
  options: asyncApiOptions,
};
