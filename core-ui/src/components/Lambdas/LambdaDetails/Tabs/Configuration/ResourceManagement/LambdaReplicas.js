import React from 'react';
import PropTypes from 'prop-types';

import { LayoutGrid } from 'fundamental-react';
import { Input } from './TableElements/Input';
import { Row } from './TableElements/Row';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

import './ResourceManagement.scss';

export function LambdaReplicas({ replicas, disabledForm, setReplicas }) {
  const panels = [
    {
      title: RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MIN_NUMBER.TITLE,
      description:
        RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MIN_NUMBER.DESCRIPTION,
      action: (
        <Input
          disabled={disabledForm}
          noLabel
          placeholder={'Min replicas'}
          type="number"
          value={replicas.min}
          onChange={e => setReplicas({ ...replicas, min: e.target.value })}
        />
      ),
    },
    {
      title: RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MAX_NUMBER.TITLE,
      description:
        RESOURCES_MANAGEMENT_PANEL.REPLICAS_MODE.MAX_NUMBER.DESCRIPTION,
      action: (
        <Input
          disabled={disabledForm}
          noLabel
          type="number"
          placeholder={'Max replicas'}
          value={replicas.max}
          onChange={e => setReplicas({ ...replicas, max: e.target.value })}
        />
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
  replicas: PropTypes.shape({
    min: PropTypes.any.isRequired,
    max: PropTypes.any.isRequired,
  }).isRequired,
  disabledForm: PropTypes.bool.isRequired,
  setReplicas: PropTypes.func.isRequired,
};
