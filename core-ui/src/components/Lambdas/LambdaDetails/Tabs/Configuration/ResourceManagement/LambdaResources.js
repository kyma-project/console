import React from 'react';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { errorClassName, inputClassName, inputNames } from './shared';

const resourcesMode = RESOURCES_MANAGEMENT_PANEL.RESOURCES;

const ErrorMsg = ({ err }) => (
  <>{err ? <div className={errorClassName}>{err}</div> : null}</>
);

export function LambdaFunctionResources({
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
                  id={inputNames.functionResources.requests.memory}
                  name={inputNames.functionResources.requests.memory}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.functionResources.limits.memory,
                    );
                  }}
                />
                <ErrorMsg err={errors?.functionRequestsMemory?.message} />
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
                  id={inputNames.functionResources.requests.cpu}
                  name={inputNames.functionResources.requests.cpu}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(inputNames.limits.cpu);
                  }}
                />
                <ErrorMsg err={errors?.functionRequestsCpu?.message} />
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
                  id={inputNames.functionResources.limits.memory}
                  name={inputNames.functionResources.limits.memory}
                  _ref={register}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.functionResources.requests.memory,
                    );
                  }}
                />
                <ErrorMsg err={errors?.functionLimitsMemory?.message} />
              </>
            }
          ></Row>
          <Row
            title={resourcesMode.CPU.TITLE}
            action={
              <>
                <Input
                  id={inputNames.functionResources.limits.cpu}
                  name={inputNames.functionResources.limits.cpu}
                  disabled={disabledForm}
                  className={inputClassName}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.functionResources.requests.cpu,
                    );
                  }}
                />
                <ErrorMsg err={errors?.functionLimitsCpu?.message} />
              </>
            }
          ></Row>
        </Panel.Body>
      </Panel>
    </LayoutGrid>
  );
}

export function LambdaBuildResources({
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
                  id={inputNames.buildResources.requests.memory}
                  name={inputNames.buildResources.requests.memory}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.buildResources.limits.memory,
                    );
                  }}
                />
                <ErrorMsg err={errors?.buildRequestsMemory?.message} />
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
                  id={inputNames.buildResources.requests.cpu}
                  name={inputNames.buildResources.requests.cpu}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.buildResources.limits.cpu,
                    );
                  }}
                />
                <ErrorMsg err={errors?.buildRequestsCpu?.message} />
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
                  id={inputNames.buildResources.limits.memory}
                  name={inputNames.buildResources.limits.memory}
                  _ref={register}
                  placeholder={resourcesMode.MEMORY.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.buildResources.requests.memory,
                    );
                  }}
                />
                <ErrorMsg err={errors?.buildLimitsMemory?.message} />
              </>
            }
          ></Row>
          <Row
            title={resourcesMode.CPU.TITLE}
            action={
              <>
                <Input
                  id={inputNames.buildResources.limits.cpu}
                  name={inputNames.buildResources.limits.cpu}
                  disabled={disabledForm}
                  className={inputClassName}
                  _ref={register}
                  placeholder={resourcesMode.CPU.TITLE}
                  onChange={async () => {
                    await triggerValidation(
                      inputNames.buildResources.requests.cpu,
                    );
                  }}
                />
                <ErrorMsg err={errors?.buildLimitsCpu?.message} />
              </>
            }
          ></Row>
        </Panel.Body>
      </Panel>
    </LayoutGrid>
  );
}
