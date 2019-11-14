import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { getServiceClass } from './queries';
import { Button, Spinner } from '@kyma-project/react-components';

import builder from '../../commons/builder';
import { serviceClassConstants } from '../../variables';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import ModalWithForm from '../../shared/ModalWithForm/ModalWithForm';
import { isStringValueEqualToTrue } from '../../commons/helpers';
import './ServiceClassDetails.scss';
import { ServiceClassDetailsWrapper, EmptyList } from './styled';

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
              <ModalWithForm
                title={`Provision the ${serviceClass.displayName}${' '}
                    ${
                      serviceClass.__typename === 'ClusterServiceClass'
                        ? 'Cluster Service Class'
                        : 'Service Class'
                    }${' '}
                    in the ${environment} Namespace`}
                button={{ text: 'Create Instance', glyph: 'add' }}
                id="add-instance-modal"
                item={serviceClass}
                renderForm={props => <CreateInstanceModal {...props} />}
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
