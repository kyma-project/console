import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { getServiceClass } from './queries';
import { Spinner } from '@kyma-project/react-components';

import {
  serviceClassConstants,
  createInstanceButtonText,
  filterExtensions,
} from '../../variables';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import ModalWithForm from '../../shared/ModalWithForm/ModalWithForm';
import { isStringValueEqualToTrue } from '../../commons/helpers';
import './ServiceClassDetails.scss';
import { ServiceClassDetailsWrapper, EmptyList } from './styled';
import LuigiClient from '@kyma-project/luigi-client';
import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from '../../commons/helpers';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

export default function ServiceClassDetails({ name }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getServiceClass, {
    variables: {
      namespace,
      name,
      fileExtensions: filterExtensions,
    },
    fetchPolicy: 'no-cache',
  });

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

  const serviceClass = queryData.clusterServiceClass || queryData.serviceClass;

  if (!serviceClass) {
    return <EmptyList>{serviceClassConstants.noClassText}</EmptyList>;
  }

  const serviceClassDisplayName = getResourceDisplayName(serviceClass);

  const serviceClassDescription = getDescription(serviceClass);

  const isProvisionedOnlyOnce =
    serviceClass.labels &&
    serviceClass.labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(serviceClass.labels.provisionOnlyOnce);

  const buttonText = isProvisionedOnlyOnce
    ? serviceClass.activated
      ? createInstanceButtonText.provisionOnlyOnceActive
      : createInstanceButtonText.provisionOnlyOnce
    : createInstanceButtonText.standard;

  const {
    providerDisplayName,
    creationTimestamp,
    documentationUrl,
    supportUrl,
    imageUrl,
    tags,
    labels,
  } = serviceClass;

  return (
    <>
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
      >
        <ModalWithForm
          title={`Provision the ${serviceClass.displayName}${' '}
                    ${
                      serviceClass.__typename === 'ClusterServiceClass'
                        ? 'Cluster Service Class'
                        : 'Service Class'
                    }${' '}
                    in the ${namespace} Namespace`}
          button={{
            text: buttonText,
            glyph: 'add',
            disabled: Boolean(isProvisionedOnlyOnce && serviceClass.activated),
          }}
          id="add-instance-modal"
          item={serviceClass}
          renderForm={props => <CreateInstanceModal {...props} />}
        />
      </ServiceClassDetailsHeader>

      <ServiceClassDetailsWrapper phoneRows>
        {backendModuleExists('rafter') && (
          <ServiceClassTabs serviceClass={serviceClass} />
        )}
      </ServiceClassDetailsWrapper>
    </>
  );
}
