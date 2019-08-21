import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Spinner,
  Panel,
  PanelBody,
} from '@kyma-project/react-components';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import { isStringValueEqualToTrue } from '../../commons/helpers';

import { ServiceClassDetailsWrapper, EmptyList } from './styled';

import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from '../../commons/helpers';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

class ServiceClassDetails extends React.Component {
  static propTypes = {
    serviceClass: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
  };

  render() {
    const { createServiceInstance } = this.props;
    const serviceClass =
      this.props.serviceClass.clusterServiceClass ||
      this.props.serviceClass.serviceClass;
    
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
    const noClassText = "Such a Service Class doesn't exist in this Namespace";

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

    if (this.props.serviceClass.loading) {
      return (
        <EmptyList>
          <Spinner />
        </EmptyList>
      );
    }
    if (!this.props.serviceClass.loading && !serviceClass) {
      return (
        <EmptyList>
          <Panel>
            <PanelBody>{noClassText}</PanelBody>
          </Panel>
        </EmptyList>
      );
    }

    const {
      providerDisplayName,
      creationTimestamp,
      documentationUrl,
      supportUrl,
      imageUrl,
      tags,
      labels,
    } = serviceClass ? serviceClass : {};

    return (
      <div>
        {serviceClass && (
          <div>
            <div> {this.arrayOfJsx} </div>
            {this.renObjData}
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
              <CreateInstanceModal
                serviceClass={serviceClass}
                modalOpeningComponent={modalOpeningComponent}
                createServiceInstance={createServiceInstance}
              />
            </ServiceClassDetailsHeader>

            <ServiceClassDetailsWrapper phoneRows>
              {backendModuleExists('cms') &&
              backendModuleExists('assetstore') ? (
                <ServiceClassTabs serviceClass={serviceClass} />
              ) : null}
            </ServiceClassDetailsWrapper>
          </div>
        )}
      </div>
    );
  }
}

export default ServiceClassDetails;
