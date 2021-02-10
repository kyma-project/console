import { getComponentFor, ResourcesList, ResourceDetails } from 'react-shared';
import * as PredefinedRenderers from 'components/Predefined';

export const getComponentForList = getComponentFor(
  PredefinedRenderers,
  ResourcesList,
);

export const getComponentForDetails = getComponentFor(
  PredefinedRenderers,
  ResourceDetails,
);
