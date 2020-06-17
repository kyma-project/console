import React from 'react';

import LambdasListWrapper from 'components/Lambdas/LambdasList/LambdasListWrapper';
import { useConfigData } from 'components/Lambdas/helpers/misc/useConfigData';

export default function Lambdas() {
  useConfigData();
  return <LambdasListWrapper />;
}
