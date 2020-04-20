import React from 'react';
import PropTypes from 'prop-types';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { errorClassName, inputClassName, inputNames } from './shared';

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
                  className={inputClassName}
                  disabled={disabledForm}
                  _ref={register}
                  name={inputNames.requests.memory}
                  placeholder={
                    RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE
                  }
                />
                <div className={errorClassName}>
                  {errors?.requestsMemory?.message}
                </div>
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
                  className={inputClassName}
                  name={inputNames.requests.cpu}
                  _ref={register}
                  placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                />
                <div className={errorClassName}>
                  {errors?.requestsCpu?.message}
                </div>
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
                  className={inputClassName}
                  name={inputNames.limits.memory}
                  _ref={register}
                  placeholder={
                    RESOURCES_MANAGEMENT_PANEL.RESOURCES.MEMORY.TITLE
                  }
                />
                <div className={errorClassName}>
                  {errors?.limitsMemory?.message}
                </div>
              </>
            }
          ></Row>
          <Row
            title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
            action={
              <>
                <Input
                  name={inputNames.limits.cpu}
                  disabled={disabledForm}
                  noLabel
                  className={inputClassName}
                  _ref={register}
                  placeholder={RESOURCES_MANAGEMENT_PANEL.RESOURCES.CPU.TITLE}
                />
                <div className={errorClassName}>
                  {errors?.limitsCpu?.message}
                </div>
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
