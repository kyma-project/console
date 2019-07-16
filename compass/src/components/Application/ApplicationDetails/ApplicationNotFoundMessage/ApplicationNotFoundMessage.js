import React from 'react';
import { Panel, PanelBody } from "@kyma-project/react-components";

export default function ApplicationNotFoundMessage() {
  return (
    <Panel className="fd-has-margin-large">
      <PanelBody className="fd-has-text-align-center fd-has-type-4">
        Such an Application doesn't exists for this Tenant.
      </PanelBody>
    </Panel>
  );
}
