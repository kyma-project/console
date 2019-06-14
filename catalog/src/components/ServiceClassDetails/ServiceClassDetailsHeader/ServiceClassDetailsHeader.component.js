import React from 'react';
import PropTypes from 'prop-types';

import ServiceClassToolbar from '../ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from '../ServiceClassInfo/ServiceClassInfo.component';

const ServiceClassDetailsHeader = ({
  creationTimestamp,
  description,
  documentationUrl,
  imageUrl,
  isProvisionedOnlyOnce,
  labels,
  providerDisplayName,
  serviceClassDisplayName,
  supportUrl,
  tags,
  children,
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
        className="none"
        creationTimestamp={creationTimestamp}
        description={description}
        documentationUrl={documentationUrl}
        imageUrl={imageUrl}
        isProvisionedOnlyOnce={isProvisionedOnlyOnce}
        labels={labels}
        providerDisplayName={providerDisplayName}
        supportUrl={supportUrl}
        tags={tags}
      />
    </div>
  );
};

ServiceClassDetailsHeader.propTypes = {
  creationTimestamp: PropTypes.number.isRequired,
  description: PropTypes.string,
  serviceClassDisplayName: PropTypes.string.isRequired,
  providerDisplayName: PropTypes.string,
  children: PropTypes.element,
  labels: PropTypes.array,
  tags: PropTypes.array,
  documentationUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  supportUrl: PropTypes.string,
};

export default ServiceClassDetailsHeader;
