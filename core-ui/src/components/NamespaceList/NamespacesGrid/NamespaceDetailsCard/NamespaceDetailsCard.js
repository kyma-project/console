import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { DELETE_NAMESPACE } from './../../../../gql/mutations';
import { useMutation } from '@apollo/react-hooks';

import { Button, Menu, Panel, Badge, Popover } from 'fundamental-react';
import './NamespaceDetailsCard.scss';

NamespaceDetailsCard.propTypes = {
  name: PropTypes.string.isRequired,
  allPodsCount: PropTypes.number.isRequired,
  healthyPodsCount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  isSystemNamespace: PropTypes.bool.isRequired,
  applications: PropTypes.array,
};

export function getPodsRatioColor(healthyPods, allPods) {
  if (allPods === 0) {
    return '#107e3e';
  }

  const podsRatio = healthyPods / allPods;

  if (podsRatio === 1) {
    return '#107e3e';
  } else if (podsRatio > 0.8) {
    return '#e9730c';
  } else {
    return '#bb0000';
  }
}

function navigateToNamespaceDetails(namespaceName) {
  LuigiClient.linkManager().navigate(
    `/home/namespaces/${namespaceName}/details`,
  );
  LuigiClient.sendCustomMessage({ id: 'console.refreshNavigation' });
}

const Spinner = () => (
  <div className="fd-loading-dots" aria-hidden="false" aria-label="Loading">
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default function NamespaceDetailsCard({
  name,
  allPodsCount,
  healthyPodsCount,
  status,
  isSystemNamespace,
  applications,
}) {
  const [deleteNamespace] = useMutation(DELETE_NAMESPACE);

  const handleNamespaceDelete = () => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${name}`,
        body: `Are you sure you want to delete namespace "${name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          await deleteNamespace({ variables: { name } });
        } catch (e) {
          console.warn(e);
          LuigiClient.uxManager().showAlert({
            text: e.message,
            type: 'error',
            closeAfter: 10000,
          });
        }
      })
      .catch(() => {});
  };

  const getPodsRatioStyle = () => {
    return { color: getPodsRatioColor(healthyPodsCount, allPodsCount) };
  };

  const popoverBody = (
    <Menu>
      <Menu.List>
        <Menu.Item
          onClick={e => {
            e.stopPropagation();
            handleNamespaceDelete(name);
          }}
        >
          Delete
        </Menu.Item>
      </Menu.List>
    </Menu>
  );

  const popoverControl = (
    <Button
      onClick={e => e.stopPropagation()}
      glyph="overflow"
      option="light"
      className="popover-control"
      aria-label="namespace-actions"
    />
  );

  const isTerminating = status === 'Terminating';
  const panelClass = classNames('namespace-details-card', {
    'namespace-details-card--terminating': isTerminating,
  });

  return (
    <Panel
      role="gridcell"
      className={panelClass}
      onClick={() => navigateToNamespaceDetails(name)}
    >
      <Panel.Header className="fd-has-color-text-1 fd-has-type-1">
        <Panel.Head title={name} />
        <span>
          {isSystemNamespace && (
            <Badge className="fd-has-margin-left-tiny">System</Badge>
          )}
        </span>
        <Popover
          body={popoverBody}
          control={popoverControl}
          placement="right"
          noArrow
          disabled={isTerminating}
        />
      </Panel.Header>
      <Panel.Body>
        <section className="namespace-details-card__body">
          <div>
            <p
              className="fd-has-type-4 fd-has-font-weight-light"
              style={getPodsRatioStyle()}
            >
              {healthyPodsCount}/{allPodsCount}
            </p>
            <p>Pods are healthy</p>
          </div>
          {applications !== null && (
            <div>
              <p className="fd-has-type-4 fd-has-font-weight-light">
                {applications.length}
              </p>
              <p>
                {applications.length === 1
                  ? 'Bound Application'
                  : 'Bound Applications'}
              </p>
            </div>
          )}
        </section>
      </Panel.Body>
      {isTerminating && (
        <div className="overlay">
          <div className="overlay-caption fd-has-type-3">
            Terminating...
            <Spinner />
          </div>
        </div>
      )}
    </Panel>
  );
}
