import React from 'react';
import {
  serviceClassConstants,
  createInstanceConstants,
} from 'helpers/constants';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';
import { Button } from 'fundamental-react';

import { isStringValueEqualToTrue } from 'helpers';
import './ServiceClassDetails.scss';
import { ServiceClassDetailsWrapper, EmptyList } from './styled';
import LuigiClient from '@luigi-project/client';
import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from 'helpers';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';
import {
  Tooltip,
  Spinner,
  ModalWithForm,
  useGetList,
  useGet,
  useMicrofrontendContext,
} from 'react-shared';

export default function ServiceClassDetails({ name }) {
  const { namespaceId } = useMicrofrontendContext();
  const { resourceType } = LuigiClient.getNodeParams();

  const serviceClassUrl = `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceclasses/${name}`;
  const clusterServiceClassUrl = `/apis/servicecatalog.k8s.io/v1beta1/clusterserviceclasses/${name}`;
  const { data: serviceClass, loading = true, error } = useGet(
    resourceType === 'ClusterServiceClass'
      ? clusterServiceClassUrl
      : serviceClassUrl,
    {
      pollingInterval: 3000,
    },
  );

  if (error) {
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassDetails}</EmptyList>
    );
  }

  if (loading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  if (!serviceClass)
    return <EmptyList>{serviceClassConstants.noClassText}</EmptyList>;

  const serviceClassDisplayName = getResourceDisplayName(serviceClass);
  const serviceClassDescription = getDescription(serviceClass);

  const tags = serviceClass.spec.tags;
  const externalLabels = serviceClass.spec.externalMetadata.labels;
  const internalLabels = serviceClass.metadata.labels;
  const labels = { ...externalLabels, ...internalLabels };
  const providerDisplayName =
    serviceClass.spec.externalMetadata.providerDisplayName;
  const creationTimestamp = serviceClass.metadata.creationTimestamp;
  const documentationUrl = serviceClass.spec.externalMetadata.documentationUrl;
  const supportUrl = serviceClass.spec.externalMetadata.supportUrl;
  const imageUrl = serviceClass.spec.externalMetadata.imageUrl;
  const isProvisionedOnlyOnce = isStringValueEqualToTrue(
    labels?.provisionOnlyOnce,
  );

  const buttonText =
    // // isProvisionedOnlyOnce
    // //   ? serviceClass.activated
    // //     ? createInstanceConstants.buttonText.provisionOnlyOnceActive
    // //     : createInstanceConstants.buttonText.provisionOnlyOnce
    // //   :
    createInstanceConstants.buttonText.standard;

  const modalOpeningComponent = (
    // <Tooltip content={createInstanceConstants.provisionOnlyOnceInfo}>
    <Button
      // disabled={isProvisionedOnlyOnce && serviceClass.activated}
      glyph="add"
    >
      {buttonText}
    </Button>
    // </Tooltip>
  );

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
        serviceClassName={name}
      >
        <ModalWithForm
          title={`Provision the ${serviceClass.displayName}${' '}
                    ${
                      serviceClass.__typename === 'ClusterServiceClass'
                        ? 'Cluster Service Class'
                        : 'Service Class'
                    }${' '}
                    in the ${namespaceId} Namespace`}
          modalOpeningComponent={modalOpeningComponent}
          id="add-instance-modal"
          item={serviceClass}
          renderForm={props => (
            <CreateInstanceModal
              {...props}
              documentationUrl={documentationUrl}
            />
          )}
        />
      </ServiceClassDetailsHeader>

      {/* <ServiceClassDetailsWrapper phoneRows>
        {backendModuleExists('rafter') && (
          <ServiceClassTabs
            serviceClass={serviceClass}
          />
        )}
      </ServiceClassDetailsWrapper> */}
    </>
  );
}
