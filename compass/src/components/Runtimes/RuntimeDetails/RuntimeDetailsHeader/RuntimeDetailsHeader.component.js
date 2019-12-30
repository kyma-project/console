import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar } from 'fundamental-react/ActionBar';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
} from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import { handleDelete } from 'react-shared';

import StatusBadge from '../../../Shared/StatusBadge/StatusBadge';
import '../../../../shared/styles/header.scss';
import { EMPTY_TEXT_PLACEHOLDER } from '../../../../shared/constants';

class RuntimeDetailsHeader extends React.Component {
  PropTypes = {
    runtime: PropTypes.object.isRequired,
    unregisterRuntime: PropTypes.func.isRequired,
  };

  navigateToRuntimesList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`/runtimes`);
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

    return (
      <>
        <header className="fd-has-background-color-background-2">
          <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
            <section>
              <Breadcrumb>
                <Breadcrumb.Item
                  name="Runtimes"
                  url="#"
                  onClick={this.navigateToRuntimesList}
                />
                <Breadcrumb.Item />
              </Breadcrumb>
              <ActionBar.Header title={name} />
            </section>
            <ActionBar.Actions>
              <Button
                onClick={() =>
                  handleDelete(
                    'Runtime',
                    id,
                    name,
                    this.props.unregisterRuntime,
                    this.navigateToRuntimesList,
                  )
                }
                type="negative"
                option="light"
              >
                Delete
              </Button>
            </ActionBar.Actions>
          </section>
          <PanelGrid nogap cols={3}>
            {status && (
              <PanelEntry
                title="Status"
                children={<StatusBadge status={status.condition} />}
              />
            )}
            <PanelEntry
              title="Description"
              children={description ? description : EMPTY_TEXT_PLACEHOLDER}
            />
            <PanelEntry title="ID" children={id} />
          </PanelGrid>
        </header>
      </>
    );
  };
}

export default RuntimeDetailsHeader;
