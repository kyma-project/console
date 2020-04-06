import { StyledComponent } from 'styled-components';
import { StyledSwagger } from './render-engines/open-api/styles';
import { StyledAsyncAPI, StyledOData } from './renderers/styled';

export const markdownDefinition: ApiDefinition = {
  possibleTypes: ['markdown', 'md'],
};

export const openApiDefinition: ApiDefinition = {
  possibleTypes: ['open-api', 'openapi', 'swagger'],
  stylingClassName: 'custom-open-api-styling',
  styledComponent: StyledSwagger,
};

export const asyncApiDefinition: ApiDefinition = {
  possibleTypes: ['async-api', 'asyncapi', 'events'],
  stylingClassName: 'custom-async-api-styling',
  styledComponent: StyledAsyncAPI,
};

export const odataDefinition: ApiDefinition = {
  possibleTypes: ['odata'],
  stylingClassName: 'odata-styling',
  styledComponent: StyledOData,
};

export const RELATIVE_LINKS_DISABLED = 'Relative links is disabled';

export interface ApiDefinition {
  possibleTypes: string[];
  stylingClassName?: string;
  styledComponent?: StyledComponent<any, any, {}, never>;
}
