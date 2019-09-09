import React, { useContext } from 'react';
import { Icon } from 'fundamental-react';
import { luigiClient } from '@kyma-project/common';

import { NavigationService } from '../services';
import { NavigationList } from './NavigationList';

import { BACK_TO_NAMESPACES } from '../constants';
import { NavigationWrapper, GoBack } from './styled';

export const Navigation: React.FunctionComponent = () => {
  const context = useContext(NavigationService);
  if (!context || !context.navigation) {
    return null;
  }

  const goToRootPage = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    luigiClient.linkManager().navigate(`/`);
  };

  return (
    <NavigationWrapper>
      <GoBack data-e2e-id="go-to-environment" onClick={goToRootPage}>
        <Icon size="m" glyph="nav-back" />
        <span>{BACK_TO_NAMESPACES}</span>
      </GoBack>
      <NavigationList navigation={context.navigation} />
    </NavigationWrapper>
  );
};
