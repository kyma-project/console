import React from 'react';
import LuigiClient from '@luigi-project/client';
import { Button } from 'fundamental-react';

import {
  Tooltip,
  Spinner,
  ModalWithForm,
  useGetList,
  useGet,
  useMicrofrontendContext,
  ResourceNotFound,
} from 'react-shared';

import './ServiceClassDetails.scss';
import {
  getResourceDisplayName,
  getDescription,
  isStringValueEqualToTrue,
} from 'helpers';
import { createInstanceConstants } from 'helpers/constants';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.component';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

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

  const resourceTypeLowercase =
    resourceType?.charAt(0).toLowerCase() + resourceType?.slice(1);
  const label =
    serviceClass?.metadata.labels['servicecatalog.k8s.io/spec.externalID'];
  const labelSelector = `?labelSelector=servicecatalog.k8s.io/spec.${resourceTypeLowercase}Ref.name%3D${label}`;
  const { data: serviceInstances } = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceinstances${labelSelector}`,
    {
      pollingInterval: 3200,
    },
  );

  const servicePlansUrl = `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceplans${labelSelector}`;
  const clusterServicePlansUrl = `/apis/servicecatalog.k8s.io/v1beta1/clusterserviceplans${labelSelector}`;
  const plansUrl =
    resourceType === 'ClusterServiceClass'
      ? clusterServicePlansUrl
      : servicePlansUrl;
  const { data: servicePlans } = useGetList()(plansUrl, {
    pollingInterval: 3500,
  });

  // notificationManager.notifyError({
  //   content: `Failed to get a list of instances due to: ${err}`,
  // });

  if (error) {
    return (
      <ResourceNotFound
        resource={resourceType}
        breadcrumb="Catalog"
        path="/"
        fromClosestContext={true}
      />
    );
  }

  if (loading || !serviceClass) {
    return <Spinner />;
  }

  const serviceClassDisplayName = getResourceDisplayName(serviceClass);
  const serviceClassDescription = getDescription(serviceClass);

  const tags = serviceClass.spec.tags;
  const externalLabels = serviceClass.spec.externalMetadata?.labels;
  const internalLabels = serviceClass.metadata.labels;
  const labels = { ...externalLabels, ...internalLabels };
  const providerDisplayName =
    serviceClass.spec.externalMetadata?.providerDisplayName;
  const creationTimestamp = serviceClass.metadata.creationTimestamp;
  const documentationUrl = serviceClass.spec.externalMetadata?.documentationUrl;
  const supportUrl = serviceClass.spec.externalMetadata?.supportUrl;
  const imageUrl = serviceClass.spec.externalMetadata?.imageUrl;
  const isProvisionedOnlyOnce = isStringValueEqualToTrue(
    labels?.provisionOnlyOnce,
  );
  const isActivated = serviceInstances?.items?.length > 0;

  const buttonText = isProvisionedOnlyOnce
    ? isActivated
      ? createInstanceConstants.buttonText.provisionOnlyOnceActive
      : createInstanceConstants.buttonText.provisionOnlyOnce
    : createInstanceConstants.buttonText.standard;

  const modalOpeningComponent = (
    <Tooltip content={createInstanceConstants.provisionOnlyOnceInfo}>
      <Button disabled={isProvisionedOnlyOnce && isActivated} glyph="add">
        {buttonText}
      </Button>
    </Tooltip>
  );

  return (
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
        title={`Provision the ${serviceClassDisplayName}${' '}
                  ${
                    resourceType === 'ClusterServiceClass'
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
            plans={servicePlans || []}
            documentationUrl={documentationUrl}
          />
        )}
      />
    </ServiceClassDetailsHeader>
  );
}
