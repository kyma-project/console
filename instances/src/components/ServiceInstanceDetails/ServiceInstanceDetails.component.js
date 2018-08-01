import React from 'react';
import HeaderBinding from './BindingHeader.component';
import styled from 'styled-components';
import {
  Header,
  Separator,
  Spinner,
  Toolbar,
  Icon,
  ThemeWrapper,
} from '@kyma-project/react-components';
import Grid from 'styled-components-grid';
import { EntriesWrapper, EmptyList } from '../shared/component-styles';
import { statusColor } from '../shared/utils-functions';
import { ConfirmationModal } from '../Modal/Modal';
import Error from '../Error/Error';
import Tabs from '../Tabs/Tabs.component';
import TabContent from '../Tabs/TabContent.component';
import {
  sortDocumentsByType,
  getDocumentsTypes,
  getResourceDisplayName,
} from '../../commons/helpers';
import Events from '../Events/Events.component';
import Apiconsole from '../SwaggerApiconsole/SwaagerApiconsole.component';
import BindingEntry from './BindingEntry.component';

const ServiceInstanceWrapper = styled.div`
  margin: 0 34px;
`;

const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  margin: ${props => ('left' === props.margin ? '30px 20px 0 0' : '30px 0 0')};
  text-align: left;
  flex: 0 1 auto;
  display: flex;
  min-height: calc(100% - 30px);
`;

const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  font-weight: normal;
  border-left: ${props => (props.color ? '6px solid ' + props.color : 'none')};
`;

const ContentWrapperTab = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  width: 100%;
  font-weight: normal;
`;

const ContentHeader = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  line-height: 1.19;
  padding: 16px 20px;
`;

const ContentDescription = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 20px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #32363b;
`;

const Element = styled.div`
  padding: 16px 0 10px;
`;

const InfoIcon = styled.div`
  width: 13px;
  height: 14px;
  line-height: 19px;
  font-family: SAP-icons;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  float: right;
  color: ${props => props.color};
`;

const GridWrapper = styled(Grid)`
  display: flex;
`;

const StretchedContentWrapper = styled(ContentWrapper)`
  align-self: stretch;
`;

class ServiceInstanceDetails extends React.Component {
  state = {
    active: null,
    openModal: false,
  };

  componentDidUpdate() {
    const { serviceInstance = {} } = this.props;

    const instance = serviceInstance.serviceInstance || {};
    if (!serviceInstance.loading && instance.serviceClass) {
      if (!this.state.active) {
        let activeTab =
          instance.serviceClass.content &&
          instance.serviceClass.content.docs &&
          instance.serviceClass.content.docs[0].type;

        if (!activeTab) {
          activeTab =
            instance.serviceClass.content &&
            instance.serviceClass.content.Docs &&
            instance.serviceClass.content.Docs[0].Type;
        }

        if (!activeTab) {
          if (instance.serviceClass.apiSpec) {
            activeTab = 'Console';
          } else if (instance.serviceClass.asyncApiSpec) {
            activeTab = 'Events';
          }
        }

        if (activeTab) this.chooseTab(activeTab);
      }
    }
  }

  chooseTab(activeTab) {
    this.setState({
      active: activeTab,
    });
  }

  statusIcon(statusType) {
    switch (statusType) {
      case 'PROVISIONING':
      case 'DEPROVISIONING':
      case 'PENDING':
        return '\uE1C4';
      case 'FAILED':
        return '\uE0B1';
      case 'RUNNING':
        return '\uE1C2';
      default:
        return '\uE1C4';
    }
  }

  getBindingEntries(
    serviceInstance,
    deleteBinding,
    deleteBindingUsage,
    refetch,
  ) {
    if (!serviceInstance.serviceBindingUsages) {
      return [];
    }

    return serviceInstance.serviceBindingUsages.map((usage, index) => {
      const usagesPointingToCurrentBindingCount = serviceInstance.serviceBindingUsages.filter(
        item => {
          if (!item.serviceBinding || !usage.serviceBinding) {
            return false;
          }

          return item.serviceBinding.name === usage.serviceBinding.name;
        },
      ).length;

      return (
        <BindingEntry
          key={index}
          entry={usage}
          deleteBinding={deleteBinding}
          deleteBindingUsage={deleteBindingUsage}
          bindingUsageCount={usagesPointingToCurrentBindingCount}
          refetch={refetch}
        />
      );
    });
  }

  render() {
    const {
      serviceInstance = {},
      deleteBinding,
      deleteBindingUsage,
      deleteServiceInstance,
      createBinding,
      createBindingUsage,
    } = this.props;
    let documentsTypes = [],
      documentsByType = [],
      eventsTopics = [];
    const serviceClass =
      (serviceInstance.serviceInstance &&
        serviceInstance.serviceInstance.serviceClass) ||
      {};
    const asyncApiSpec = serviceClass.asyncApiSpec || {};

    if (!serviceInstance.loading && serviceClass) {
      documentsByType = sortDocumentsByType(serviceClass.content);
      documentsTypes = getDocumentsTypes(serviceClass, documentsByType) || [];

      if (serviceClass.asyncApiSpec && serviceClass.asyncApiSpec.topics) {
        eventsTopics = Object.keys(serviceClass.asyncApiSpec.topics);
      }
    }

    if (serviceInstance.loading) {
      return (
        <EmptyList>
          <Spinner size="40px" color="#32363a" />
        </EmptyList>
      );
    }

    if (!serviceInstance.loading && !serviceInstance.serviceInstance) {
      return <EmptyList>Service Instance doesn't exist</EmptyList>;
    }

    const instance = serviceInstance.serviceInstance;
    const bindingEntries = this.getBindingEntries(
      instance,
      deleteBinding,
      deleteBindingUsage,
      serviceInstance.refetch,
    );
    const handleDelete = async () => {
      await deleteServiceInstance(instance.name);
      this.props.history.goBack();
    };

    const data = {
      serviceInstance: instance,
    };

    const status = instance.status || {};

    return (
      <ThemeWrapper>
        <Toolbar
          headline={`Service Instances / ${instance.name}`}
          description={
            instance &&
            instance.serviceClass &&
            instance.serviceClass.description
          }
        >
          <ConfirmationModal
            title="Delete"
            message={`Are you sure you want to delete ${instance.name}?`}
            modalOpeningComponent="Delete"
            handleConfirmation={handleDelete}
            warning
            entryName="details"
          />
        </Toolbar>
        <Error error={serviceInstance.error} />
        <ServiceInstanceWrapper>
          <GridWrapper>
            <Grid.Unit size={0.7}>
              <CenterSideWrapper margin={'left'}>
                <StretchedContentWrapper>
                  <ContentHeader>
                    <Header>General Information</Header>
                  </ContentHeader>
                  <Separator />
                  <ContentDescription>
                    <Grid>
                      <Grid.Unit size={0.2}>
                        <Element>Service Class</Element>
                      </Grid.Unit>
                      <Grid.Unit size={0.8}>
                        <Element data-e2e-id="instance-service-class">
                          {getResourceDisplayName(instance.serviceClass)}
                        </Element>
                      </Grid.Unit>
                      <Grid.Unit size={0.2}>
                        <Element>Plan</Element>
                      </Grid.Unit>
                      <Grid.Unit size={0.8}>
                        <Element data-e2e-id="instance-service-plan">
                          {getResourceDisplayName(instance.servicePlan)}
                        </Element>
                      </Grid.Unit>
                    </Grid>
                  </ContentDescription>
                </StretchedContentWrapper>
              </CenterSideWrapper>
            </Grid.Unit>
            <Grid.Unit size={0.3}>
              <CenterSideWrapper>
                <StretchedContentWrapper color={statusColor(status.type)}>
                  <ContentHeader>
                    <Grid>
                      <Grid.Unit size={0.9}>
                        <Header>Status</Header>
                      </Grid.Unit>
                      <Grid.Unit size={0.1}>
                        <InfoIcon color={statusColor(status.type)}>
                          <Icon>{this.statusIcon(status.type)}</Icon>
                        </InfoIcon>
                      </Grid.Unit>
                    </Grid>
                  </ContentHeader>
                  <Separator />
                  <ContentDescription>
                    <Element data-e2e-id="instance-status-type">
                      {status.type}
                    </Element>
                    <Element data-e2e-id="instance-status-message">
                      {status.message}
                    </Element>
                  </ContentDescription>
                </StretchedContentWrapper>
              </CenterSideWrapper>
            </Grid.Unit>
          </GridWrapper>
          <div>
            <HeaderBinding
              data={data}
              refetch={serviceInstance.refetch}
              createBindingUsage={createBindingUsage}
              createBinding={createBinding}
            />
            <EntriesWrapper>
              {bindingEntries.length > 0 ? bindingEntries : 'No Bindings'}
            </EntriesWrapper>
          </div>
          {documentsTypes.length > 0 && (
            <CenterSideWrapper>
              <ContentWrapperTab>
                <Tabs
                  items={documentsTypes}
                  callbackParent={newState => {
                    this.chooseTab(newState);
                  }}
                  active={this.state.active}
                >
                  {documentsTypes.map(type => (
                    <TabContent
                      key={type}
                      active={this.state.active}
                      title={type}
                    >
                      {documentsByType &&
                        documentsByType[type] &&
                        documentsByType[type].map((item, i) => (
                          <div
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: item.source || item.Source,
                            }}
                          />
                        ))}
                    </TabContent>
                  ))}
                  <TabContent active={this.state.active} title={'Console'}>
                    {serviceClass.apiSpec && (
                      <div>
                        <Apiconsole
                          //FIXME: Change url
                          url="http://petstore.swagger.io/v1/swagger.json"
                          schema={serviceClass.apiSpec}
                        />
                      </div>
                    )}
                  </TabContent>
                  <TabContent active={this.state.active} title={'Events'}>
                    {eventsTopics &&
                      serviceClass &&
                      asyncApiSpec &&
                      asyncApiSpec.topics &&
                      asyncApiSpec.info && (
                        <Events
                          data={asyncApiSpec.topics}
                          topics={eventsTopics}
                          title={asyncApiSpec.info.title}
                          description={
                            serviceClass.asyncApiSpec.info.description
                          }
                        />
                      )}
                  </TabContent>
                </Tabs>
              </ContentWrapperTab>
            </CenterSideWrapper>
          )}
        </ServiceInstanceWrapper>
      </ThemeWrapper>
    );
  }
}

export default ServiceInstanceDetails;
