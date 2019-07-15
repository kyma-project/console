import React from 'react';
import { Panel, PanelBody } from "@kyma-project/react-components";

export default function ApplicationNotFoundMessage(props) {
  return (
    <Panel className="fd-has-margin-large">
      <PanelBody className="fd-has-text-align-center">
        Such an Application doesn't exists for this Tenant.
      </PanelBody>
    </Panel>
  );
}
