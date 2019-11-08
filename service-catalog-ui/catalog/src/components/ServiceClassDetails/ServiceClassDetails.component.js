import React, { useEffect, useState } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { getServiceClass } from './queries';
import { createServiceInstance } from './mutations';
import { Button, Spinner } from '@kyma-project/react-components';

import builder from '../../commons/builder';
import { serviceClassConstants } from '../../variables';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';
import CreateInstanceModalNew from './CreateInstanceModal/CreateInstanceModal';

import ModalWithForm from '../../shared/ModalWithForm/ModalWithForm';
import { isStringValueEqualToTrue } from '../../commons/helpers';
import './ServiceClassDetails.scss';
import { Bold, ServiceClassDetailsWrapper, EmptyList } from './styled';

import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from '../../commons/helpers';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

export default function ServiceClassDetails({ match }) {
  const [serviceClass, setServiceClass] = useState(null);
  const filterExtensions = ['md', 'xml', 'json', 'yml', 'yaml'];

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getServiceClass, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      name: match.params.name,
      fileExtensions: filterExtensions,
    },
  });

  const [createServiceInstanceMutation] = useMutation(createServiceInstance);

  useEffect(() => {
    if (queryData && !queryLoading && !queryError) {
      setServiceClass(queryData.clusterServiceClass || queryData.serviceClass);
    }
  }, [queryData, queryLoading, queryError]);

  if (queryLoading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  if (queryError) {
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassDetails}</EmptyList>
    );
  }
  if (!serviceClass) {
    return <EmptyList>{serviceClassConstants.noClassText}</EmptyList>;
  }

  const serviceClassDisplayName = getResourceDisplayName(serviceClass);

  const serviceClassDescription = getDescription(serviceClass);

  const isProvisionedOnlyOnce =
    serviceClass &&
    serviceClass.labels &&
    serviceClass.labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(serviceClass.labels.provisionOnlyOnce);

  const buttonText = {
    provisionOnlyOnce: 'Add once',
    provisionOnlyOnceActive: 'Added once',
    standard: 'Add',
  };

  const modalOpeningComponent = (
    <Button
      option="emphasized"
      data-e2e-id="add-to-env"
      disabled={Boolean(isProvisionedOnlyOnce && serviceClass.activated)}
    >
      {isProvisionedOnlyOnce
        ? serviceClass.activated
          ? buttonText.provisionOnlyOnceActive
          : buttonText.provisionOnlyOnce
        : buttonText.standard}
    </Button>
  );

  const {
    providerDisplayName,
    creationTimestamp,
    documentationUrl,
    supportUrl,
    imageUrl,
    tags,
    labels,
    __typename,
  } = serviceClass ? serviceClass : {};
  const environment = builder.getCurrentEnvironmentId();
  return (
    <div>
      {serviceClass && (
        <div>
          <ServiceClassDetailsHeader
            serviceClassDisplayName={serviceClassDisplayName}
            providerDisplayName={providerDisplayName}
            creationTimestamp={creationTimestamp}
            documentationUrl={documentationUrl}
            supportUrl={supportUrl}
            imageUrl={imageUrl}
            tags={tags}
            labels={labels}
            description={serviceClassDescription}
            isProvisionedOnlyOnce={isProvisionedOnlyOnce}
            typename={__typename}
          >
            <>
              <CreateInstanceModal
                serviceClass={serviceClass}
                modalOpeningComponent={modalOpeningComponent}
                createServiceInstance={createServiceInstanceMutation}
              />
              <ModalWithForm
                title={
                  <p style={{ marginRight: '25px' }}>
                    Provision the <Bold>{serviceClass.displayName}</Bold>{' '}
                    {serviceClass.__typename === 'ClusterServiceClass'
                      ? 'Cluster Service Class'
                      : 'Service Class'}{' '}
                    in the <Bold>{environment}</Bold> Namespace
                  </p>
                }
                button={{ text: 'Create Instance', glyph: 'add' }}
                id="add-instance-modal"
                item={serviceClass}
                renderForm={props => <CreateInstanceModalNew {...props} />}
              />
            </>
          </ServiceClassDetailsHeader>

          <ServiceClassDetailsWrapper phoneRows>
            {backendModuleExists('cms') && backendModuleExists('assetstore') ? (
              <ServiceClassTabs serviceClass={serviceClass} />
            ) : null}
          </ServiceClassDetailsWrapper>
        </div>
      )}
    </div>
  );
}
