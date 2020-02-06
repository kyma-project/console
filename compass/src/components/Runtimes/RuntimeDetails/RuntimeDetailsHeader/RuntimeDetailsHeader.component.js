import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelGrid } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader, StatusBadge, EMPTY_TEXT_PLACEHOLDER } from 'react-shared';
import '../../../../shared/styles/header.scss';

class RuntimeDetailsHeader extends React.Component {
  PropTypes = {
    runtime: PropTypes.object.isRequired,
    unregisterRuntime: PropTypes.func.isRequired,
  };

  navigateToRuntimesList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  };

  render = () => {
    const { name, description, id, status } = this.props.runtime;

    const PanelEntry = props => {
      return (
        <Panel>
          <Panel.Body>
            <p className="fd-has-color-text-4 fd-has-margin-bottom-none">
              {props.title}
            </p>
            {props.content}
          </Panel.Body>
        </Panel>
      );
    };

    const breadcrumbItems = [{ name: 'Runtimes', path: '/' }, { name: '' }];

    return (
      <>
        <PageHeader breadcrumbItems={breadcrumbItems} title={name} />
        <PanelGrid nogap cols={3}>
          {status && (
            <PanelEntry
              title="Status"
              content={<StatusBadge status={status.condition} />}
            />
          )}
          <PanelEntry
            title="Description"
            content={description ? description : EMPTY_TEXT_PLACEHOLDER}
          />
          <PanelEntry title="ID" content={id} />
        </PanelGrid>
      </>
    );
  };
}

export default RuntimeDetailsHeader;
