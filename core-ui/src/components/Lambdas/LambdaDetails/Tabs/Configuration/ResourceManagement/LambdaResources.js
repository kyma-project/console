import React from 'react';
import PropTypes from 'prop-types';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

export function LambdaResources({ disabledForm, register, errors }) {
  return (
    <LayoutGrid cols={2}>
      <Panel className="has-box-shadow-none">
        <Panel.Header className="has-padding-none has-none-border-bottom">
          <Panel.Head
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.REQUESTS.TITLE}
            description={
              RESOURCES_MANAGEMENT_PANEL.RESOURCES.REQUESTS.DESCRIPTION
            }
          />
        </Panel.Header>
        <Panel.Body className="has-padding-none">
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE}
            action={
              <>
                <Input
                  disabled={disabledForm}
                  _ref={register}
                  name="requestsMemory"
                  placeholder={
                    RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE
                  }
                />
                <span>{errors?.requestsMemory?.message}</span>
              </>
            }
          ></Row>
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
            action={
              <>
                <Input
                  disabled={disabledForm}
                  noLabel
                  name="requestsCpu"
                  _ref={register}
                  placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                />
                <span>{errors?.requestsCpu?.message}</span>
              </>
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
              <>
                <Input
                  disabled={disabledForm}
                  noLabel
                  name="limitsMemory"
                  _ref={register}
                  placeholder={
                    RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE
                  }
                />
                <span>{errors?.limitsMemory?.message}</span>
              </>
            }
          ></Row>
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
            action={
              <>
                <Input
                  name={'limitsCpu'}
                  disabled={disabledForm}
                  noLabel
                  _ref={register}
                  placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                />
                <span>{errors?.limitsCpu?.message}</span>
              </>
            }
          ></Row>
        </Panel.Body>
      </Panel>
    </LayoutGrid>
  );
}

LambdaResources.propTypes = {
  register: PropTypes.any.isRequired,
  disabledForm: PropTypes.bool.isRequired,
};
