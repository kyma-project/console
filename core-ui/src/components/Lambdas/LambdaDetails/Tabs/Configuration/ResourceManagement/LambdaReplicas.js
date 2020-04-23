import React from 'react';
import PropTypes from 'prop-types';

import { LayoutGrid } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

import './ResourceManagement.scss';
import { errorClassName, inputClassName, inputNames } from './shared';

export function LambdaReplicas({ disabledForm, register, errors }) {
  const panels = [
    {
      title: RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MIN_NUMBER.TITLE,
      description:
        RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MIN_NUMBER.DESCRIPTION,
      action: (
        <>
          <Input
            className={inputClassName}
            name={inputNames.replicas.min}
            disabled={disabledForm}
            type="number"
            _ref={register}
            min="0"
          />
          {errors?.minReplicas?.message && (
            <div className={errorClassName}>{errors?.minReplicas?.message}</div>
          )}
        </>
      ),
    },
    {
      title: RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MAX_NUMBER.TITLE,
      description:
        RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MAX_NUMBER.DESCRIPTION,
      action: (
        <>
          <Input
            className={inputClassName}
            disabled={disabledForm}
            min="0"
            name={inputNames.replicas.max}
            type="number"
            _ref={register}
          />
          {errors?.maxReplicas?.message && (
            <div className={errorClassName}>{errors?.maxReplicas?.message}</div>
          )}
        </>
      ),
    },
  ];

  return (
    <LayoutGrid cols={panels.length} className="has-bottom-margin">
      {panels.map(panel => (
        <Row
          key={panel.title}
          title={panel.title}
          description={panel.description}
          action={panel.action}
        ></Row>
      ))}
    </LayoutGrid>
  );
}

LambdaReplicas.propTypes = {
  register: PropTypes.func.isRequired,
  disabledForm: PropTypes.bool.isRequired,
};
