import React from 'react';
import PropTypes from 'prop-types';

import ServiceClassToolbar from '../ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from '../ServiceClassInfo/ServiceClassInfo.component';

const ServiceClassDetailsHeader = ({
  serviceClassDisplayName,
  providerDisplayName,
  children,
  creationTimestamp,
  documentationUrl,
  supportUrl,
  imageUrl,
  labels,
  tags,
  description,
  isProvisionedOnlyOnce,
}) => {
  return (
    <div>
      <ServiceClassToolbar
        serviceClassDisplayName={serviceClassDisplayName}
        providerDisplayName={providerDisplayName}
      >
        {children}
      </ServiceClassToolbar>
      <ServiceClassInfo
        className="fd-has-padding-top-small"
        providerDisplayName={providerDisplayName}
        creationTimestamp={creationTimestamp}
        tags={tags}
        labels={labels}
        supportUrl={supportUrl}
        imageUrl={imageUrl}
        documentationUrl={documentationUrl}
        description={description}
        isProvisionedOnlyOnce={isProvisionedOnlyOnce}
      />
    </div>
  );
};

ServiceClassDetailsHeader.propTypes = {
  arrayOfJsx: PropTypes.any,
  renObjData: PropTypes.any,
  serviceClassDisplayName: PropTypes.string.isRequired,
  providerDisplayName: PropTypes.string,
  children: PropTypes.element,
  tags: PropTypes.array,
  // history: PropTypes.object.isRequired,
};

export default ServiceClassDetailsHeader;
