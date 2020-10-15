import React, { useState, useEffect } from 'react';

import { LayoutGrid, Panel } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';
import { DropdownInput } from 'components/Lambdas/components';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';
import {
  ErrorMessage,
  inputClassName,
  inputNames as names,
  customPreset,
  isCustomPreset,
} from './shared';

const resourcesMode = RESOURCES_MANAGEMENT_PANEL.RESOURCES;

export default function LambdaResources({
  disabledForm,
  register,
  errors = {},
  type = 'function',
  triggerValidation = () => void 0,
  retriggerValidation = () => void 0,
  setValue = () => void 0,
  defaultPreset = customPreset,
}) {
  const [currentPreset, setCurrentPreset] = useState(defaultPreset);

  useEffect(() => {
    if (disabledForm) {
      setCurrentPreset(defaultPreset);
    }
  }, [defaultPreset, disabledForm, setCurrentPreset]);

  const inputNames = names[type];
  const presets = CONFIG[`${type}ResourcesPresets`];

  const presetOptions = Object.entries(presets).map(([preset, values]) => ({
    key: `${preset} (${Object.entries(values)
      .map(([t, v]) => `${t}: ${v}`)
      .join(', ')})`,
    value: preset,
  }));
  presetOptions.push({
    key: 'Custom',
    value: customPreset,
  });

  async function onChangePreset(e) {
    const preset = e.target.value;
    if (preset) {
      if (presets && preset !== customPreset) {
        const values = presets[preset];
        setValue(inputNames.requests.memory, values.requestMemory);
        setValue(inputNames.requests.cpu, values.requestCpu);
        setValue(inputNames.limits.memory, values.limitMemory);
        setValue(inputNames.limits.cpu, values.limitCpu);
        await retriggerValidation();
      }
      setCurrentPreset(preset);
    }
  }

  let isHidden = !isCustomPreset(currentPreset);

  return (
    <>
      <LayoutGrid cols={1}>
        <Panel
          className={`has-box-shadow-none presets${
            isHidden ? ' has-no-margin-bottom' : ''
          }`}
        >
          <Panel.Body className="has-padding-none">
            <Row
              action={
                <DropdownInput
                  disabled={disabledForm}
                  options={presetOptions}
                  _ref={register}
                  id={inputNames.preset}
                  name={inputNames.preset}
                  onChange={onChangePreset}
                />
              }
            />
          </Panel.Body>
        </Panel>
      </LayoutGrid>
      <LayoutGrid cols={2} className={isHidden ? 'hidden-panel' : ''}>
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
                  <ErrorMessage
                    errors={errors}
                    field={inputNames.requests.memory}
                  />
                </>
              }
            />
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
                  <ErrorMessage
                    errors={errors}
                    field={inputNames.requests.cpu}
                  />
                </>
              }
            />
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
                  <ErrorMessage
                    errors={errors}
                    field={inputNames.limits.memory}
                  />
                </>
              }
            />
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
                  <ErrorMessage errors={errors} field={inputNames.limits.cpu} />
                </>
              }
            />
          </Panel.Body>
        </Panel>
      </LayoutGrid>
    </>
  );
}
