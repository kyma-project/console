import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@kyma-project/react-components';

import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from './ServiceClassInfo/ServiceClassInfo.component';
import ServiceClassDescription from './ServiceClassDescription/ServiceClassDescription.component';
import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import {
  ServiceClassDetailsWrapper,
  LeftSideWrapper,
  CenterSideWrapper,
} from './styled';

import { getResourceDisplayName, getDescription } from '../../commons/helpers';

class ServiceClassDetails extends React.Component {
  static propTypes = {
    clusterServiceClass: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
  };

  render() {
    const { clusterServiceClass, history, createServiceInstance } = this.props;

    const clusterServiceClassDisplayName = getResourceDisplayName(
      clusterServiceClass.clusterServiceClass,
    );

    const clusterServiceClassDescription = getDescription(
      clusterServiceClass.clusterServiceClass,
    );

    const modalOpeningComponent = (
      <Button normal primary first last microFullWidth data-e2e-id="add-to-env">
        Add to your Environment
      </Button>
    );

    return (
      <div>
        {clusterServiceClass.clusterServiceClass && (
          <div>
            <div> {this.arrayOfJsx} </div>
            {this.renObjData}
            <ServiceClassToolbar
              arrayOfJsx={this.arrayOfJsx}
              renObjData={this.renObjData}
              history={history}
              clusterServiceClassDisplayName={clusterServiceClassDisplayName}
            >
              <CreateInstanceModal
                clusterServiceClass={clusterServiceClass}
                modalOpeningComponent={modalOpeningComponent}
                createServiceInstance={createServiceInstance}
              />
            </ServiceClassToolbar>

            <ServiceClassDetailsWrapper phoneRows>
              <LeftSideWrapper>
                <ServiceClassInfo
                  clusterServiceClassDisplayName={
                    clusterServiceClassDisplayName
                  }
                  providerDisplayName={
                    clusterServiceClass.clusterServiceClass.providerDisplayName
                  }
                  creationTimestamp={
                    clusterServiceClass.clusterServiceClass.creationTimestamp
                  }
                  documentationUrl={
                    clusterServiceClass.clusterServiceClass.documentationUrl
                  }
                  supportUrl={
                    clusterServiceClass.clusterServiceClass.supportUrl
                  }
                  imageUrl={clusterServiceClass.clusterServiceClass.imageUrl}
                  tags={clusterServiceClass.clusterServiceClass.tags}
                />
              </LeftSideWrapper>
              <CenterSideWrapper>
                {clusterServiceClassDescription && (
                  <ServiceClassDescription
                    description={clusterServiceClassDescription}
                  />
                )}
                <ServiceClassTabs clusterServiceClass={clusterServiceClass} />
              </CenterSideWrapper>
            </ServiceClassDetailsWrapper>
          </div>
        )}
      </div>
    );
  }
}

export default ServiceClassDetails;
