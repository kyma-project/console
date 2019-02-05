import React from 'react';
import { Icon } from '@kyma-project/react-components';
import NavigationList from './NavigationList/NavigationList';

import { GoBack } from './styled';

function LeftNavigation(props) {
  return (
    <>
      <GoBack data-e2e-id="go-to-environment" onClick={props.history.goBack}>
        <Icon size="m" glyph="nav-back" />Back to Environment
      </GoBack>
      <NavigationList {...props} />
    </>
  );
}

export default LeftNavigation;
