import React from 'react';

import { LayoutGrid } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';

import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { ErrorMessage, inputClassName, inputNames } from './shared';

const replicasMode = RESOURCES_MANAGEMENT_PANEL.REPLICAS;

export default function LambdaReplicas({
  disabledForm,
  register,
  errors,
  triggerValidation = () => void 0,
  retriggerValidation = () => void 0,
}) {
  const panels = [
    {
      title: replicasMode.MIN_NUMBER.TITLE,
      description: replicasMode.MIN_NUMBER.DESCRIPTION,
      action: (
        <>
          <Input
            className={inputClassName}
            name={inputNames.replicas.min}
            id={inputNames.replicas.min}
            disabled={disabledForm}
            type="number"
            _ref={register}
            onChange={async () => {
              await triggerValidation(inputNames.replicas.max);
            }}
            min="0"
          />
          <ErrorMessage errors={errors} field={inputNames.replicas.min} />
        </>
      ),
    },
    {
      title: replicasMode.MAX_NUMBER.TITLE,
      description: replicasMode.MAX_NUMBER.DESCRIPTION,
      action: (
        <>
          <Input
            className={inputClassName}
            disabled={disabledForm}
            id={inputNames.replicas.max}
            min="0"
            name={inputNames.replicas.max}
            type="number"
            onChange={async () => {
              await triggerValidation(inputNames.replicas.min);
            }}
            _ref={register}
          />
          <ErrorMessage errors={errors} field={inputNames.replicas.max} />
        </>
      ),
    },
  ];

  return (
    <>
      <LayoutGrid cols={panels.length}>
        {panels.map(panel => (
          <Row
            key={panel.title}
            title={panel.title}
            description={panel.description}
            action={panel.action}
          ></Row>
        ))}
      </LayoutGrid>
    </>
  );
}
