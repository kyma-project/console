import { RenderEngineWithOptions } from '@kyma-project/documentation-component';
import {
  openApiRenderEngine,
  OpenApiProps,
} from '@kyma-project/dc-open-api-render-engine';

import { ApiConsolePlugin } from './plugins';

export const openApiRE: RenderEngineWithOptions<OpenApiProps> = {
  renderEngine: openApiRenderEngine,
  options: {
    plugins: [ApiConsolePlugin],
  },
};
