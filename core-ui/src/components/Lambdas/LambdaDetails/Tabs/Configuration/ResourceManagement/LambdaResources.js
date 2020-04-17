import React from 'react';
import PropTypes from 'prop-types';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

export function LambdaResources({ resources, disabledForm, setResources }) {
  const requests = resources.requests;
  const limits = resources.limits;

  return (
    <LayoutGrid cols={2}>
      <Panel className="has-box-shadow-none">
        <Panel.Header className="has-padding-none has-none-border-bottom">
          <Panel.Head
            title={
              RESOURCES_MANAGEMENT_PANEL.RESOURCES.REQUESTS.TITLE +
              ' dodaj tutaj inline helpa'
            }
            description={
              RESOURCES_MANAGEMENT_PANEL.RESOURCES.REQUESTS.DESCRIPTION
            }
          />
        </Panel.Header>
        <Panel.Body className="has-padding-none">
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE}
            action={
              <Input
                disabled={disabledForm}
                noLabel
                placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE}
                value={requests.memory}
                onChange={e => {
                  setResources({
                    ...resources,
                    requests: {
                      cpu: requests.cpu,
                      memory: e.target.value || '',
                    },
                  });
                }}
              />
            }
          ></Row>
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
            action={
              <Input
                disabled={disabledForm}
                noLabel
                placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                value={requests.cpu}
                onChange={e => {
                  setResources({
                    ...resources,
                    requests: {
                      cpu: e.target.value || '',
                      memory: requests.memory,
                    },
                  });
                }}
              />
            }
          ></Row>
        </Panel.Body>
      </Panel>
      <Panel className="has-box-shadow-none">
        <Panel.Header className="has-padding-none has-none-border-bottom">
          <Panel.Head
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.LIMITS.TITLE}
            description={
              RESOURCES_MANAGEMENT_PANEL.RESOURCES.LIMITS.DESCRIPTION
            }
          />
        </Panel.Header>
        <Panel.Body className="has-padding-none">
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE}
            action={
              <Input
                disabled={disabledForm}
                noLabel
                placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE}
                value={limits.memory}
                onChange={e => {
                  setResources({
                    ...resources,
                    limits: {
                      memory: e.target.value || '',
                      cpu: limits.cpu,
                    },
                  });
                }}
              />
            }
          ></Row>
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
            action={
              <Input
                id="lambdaName"
                disabled={disabledForm}
                noLabel
                placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                value={limits.cpu}
                onChange={e => {
                  setResources({
                    ...resources,
                    limits: {
                      memory: limits.memory,
                      cpu: e.target.value || '',
                    },
                  });
                }}
              />
            }
          ></Row>
        </Panel.Body>
      </Panel>
    </LayoutGrid>
  );
}

LambdaResources.propTypes = {
  resources: PropTypes.shape({
    limits: PropTypes.shape({
      cpu: PropTypes.string.isRequired,
      memory: PropTypes.string.isRequired,
    }),
    requests: PropTypes.shape({
      cpu: PropTypes.string.isRequired,
      memory: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
