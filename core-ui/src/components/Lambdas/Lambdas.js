import React from 'react';

import Wrapper from 'components/Lambdas/LambdasList/Wrapper';
import { useConfigData } from 'components/Lambdas/helpers/misc/useConfigData';

export default function Lambdas() {
  useConfigData();
  return <Wrapper />;
}
