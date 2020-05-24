import React from 'react';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { errorClassName, inputClassName, inputNames } from './shared';

const resourcesMode = RESOURCES_MANAGEMENT_PANEL.RESOURCES;

export default function LambdaResources({
  disabledForm,
  register,
  errors,
  triggerValidation = () => void 0,
}) {
  return (
    <LayoutGrid cols={2}>
      <Panel className="has-box-shadow-none">
        <Panel.Header className="has-padding-none has-none-border-bottom">
          <Panel.Head
            title={resourcesMode.REQUESTS.TITLE}
            description={resourcesMode.REQUESTS.DESCRIPTION}
          />
        </Panel.Header>
        <Panel.Body className="has-padding-none">
          <Row
            title={resourcesMode.MEMORY.TITLE}
            action={
              <>
                <Input
                  className={inputClassName}
                  disabled={disabledForm}
                  _ref={register}
                  id={inputNames.requests.memory}
                  name={inputNames.requests.memory}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(inputNames.limits.memory);
                  }}
                />
                {errors?.requestsMemory?.message && (
                  <div className={errorClassName}>
                    {errors.requestsMemory.message}
                  </div>
                )}
              </>
            }
          ></Row>
          <Row
            title={resourcesMode.CPU.TITLE}
            action={
              <>
                <Input
                  disabled={disabledForm}
                  className={inputClassName}
                  id={inputNames.requests.cpu}
                  name={inputNames.requests.cpu}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(inputNames.limits.cpu);
                  }}
                />
                {errors?.requestsCpu?.message && (
                  <div className={errorClassName}>
                    {errors.requestsCpu.message}
                  </div>
                )}
              </>
            }
          ></Row>
        </Panel.Body>
      </Panel>
      <Panel className="has-box-shadow-none">
        <Panel.Header className="has-padding-none has-none-border-bottom">
          <Panel.Head
            title={resourcesMode.LIMITS.TITLE}
            description={resourcesMode.LIMITS.DESCRIPTION}
          />
        </Panel.Header>
        <Panel.Body className="has-padding-none">
          <Row
            title={resourcesMode.MEMORY.TITLE}
            action={
              <>
                <Input
                  disabled={disabledForm}
                  className={inputClassName}
                  id={inputNames.limits.memory}
                  name={inputNames.limits.memory}
                  _ref={register}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(inputNames.requests.memory);
                  }}
                />
                {errors?.limitsMemory?.message && (
                  <div className={errorClassName}>
                    {errors.limitsMemory.message}
                  </div>
                )}
              </>
            }
          ></Row>
          <Row
            title={resourcesMode.CPU.TITLE}
            action={
              <>
                <Input
                  id={inputNames.limits.cpu}
                  name={inputNames.limits.cpu}
                  disabled={disabledForm}
                  className={inputClassName}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(inputNames.requests.cpu);
                  }}
                />
                {errors?.limitsCpu?.message && (
                  <div className={errorClassName}>
                    {errors.limitsCpu.message}
                  </div>
                )}
              </>
            }
          ></Row>
        </Panel.Body>
      </Panel>
    </LayoutGrid>
  );
}
