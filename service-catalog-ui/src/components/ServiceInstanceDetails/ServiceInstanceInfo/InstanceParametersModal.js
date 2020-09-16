import React from 'react';
import PropTypes from 'prop-types';

import { Modal, JSONEditor } from 'react-shared';
import { getResourceDisplayName } from 'helpers';
import { serviceInstanceConstants } from 'helpers/constants';

InstanceParametersModal.propTypes = {
  serviceInstance: PropTypes.object.isRequired,
  instancePlan: PropTypes.object.isRequired,
};

export default function InstanceParametersModal({
  serviceInstance,
  instancePlan,
}) {
  const formattedPlan = JSON.stringify(serviceInstance.planSpec, null, 2);

  const modalOpeningComponent = (
    <button className="link has-padding-0" option="light">
      {getResourceDisplayName(instancePlan)}
    </button>
  );

  return (
    <Modal
      modalOpeningComponent={modalOpeningComponent}
      title={serviceInstanceConstants.instanceParameters}
      confirmText="Close"
    >
      <JSONEditor readonly={true} text={formattedPlan} />
    </Modal>
  );
}
