import React from 'react';

import SecretData from '../../shared/components/Secret/SecretData';

export const SecretsDetails = DefaultRenderer => ({ ...otherParams }) => {
  const Secret = resource => <SecretData secret={resource} />;
  return <DefaultRenderer customComponents={[Secret]} {...otherParams} />;
};
