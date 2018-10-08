import React from 'react';

import {
  ToolbarWrapper,
  ToolbarBackButton,
  ToolbarDescription,
  ToolbarHeadline,
  ToolbarRight,
} from './components';

const Toolbar = props => (
  <ToolbarWrapper
    addSeparator={props.addSeparator}
    customPadding={props.customPadding}
    smallText={props.smallText}
    data-e2e-id="toolbar"
  >
    {props.back && (
      <ToolbarBackButton
        largeBackButton={props.largeBackButton}
        smallText={props.smallText}
        onClick={props.back}
        data-e2e-id="toolbar-back"
      >
        {props.largeBackButton && <span>BACK</span>}
      </ToolbarBackButton>
    )}
    <div>
      <ToolbarHeadline
        smallText={props.smallText}
        data-e2e-id="toolbar-headline"
      >
        {props.headline}
      </ToolbarHeadline>
      {props.description && (
        <ToolbarDescription data-e2e-id="toolbar-description">
          {props.description}
        </ToolbarDescription>
      )}
    </div>
    <ToolbarRight data-e2e-id="toolbar-children">{props.children}</ToolbarRight>
  </ToolbarWrapper>
);

export default Toolbar;
