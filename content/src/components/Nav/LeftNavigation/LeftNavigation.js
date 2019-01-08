import React, { Fragment } from "react";

import { Toolbar } from '@kyma-project/react-components';
import NavigationList from "./NavigationList/NavigationList";

function LeftNavigation(props) {
  return (
    <Fragment>
      <Toolbar
        headline="Docs"
        addSeparator
        smallText
        back={props.history.goBack}
      />
      <NavigationList {...props} />
    </Fragment>
  );
}

export default LeftNavigation;
