import React from 'react';
import PropTypes from 'prop-types';
import { Counter } from 'fundamental-react/Badge';
import LuigiClient from '@kyma-project/luigi-client';

import CreateApplicationModal from './CreateApplicationModal/CreateApplicationModal.container';
import CreateApplicationFromTemplateModal from './CreateApplicationFromTemplateModal/CreateApplicationFromTemplateModal';
import StatusBadge from '../Shared/StatusBadge/StatusBadge';
import { GenericList, handleDelete, PageHeader } from 'react-shared';
import { EMPTY_TEXT_PLACEHOLDER } from '../../shared/constants';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';
import { Popover, Menu, Button } from 'fundamental-react';

class Applications extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
  };

  headerRenderer = applications => [
    'Name',
    'Provider name',
    'Description',
    'Scenarios',
    'API Definitions',
    'Event Definitions',
    'Status',
  ];

  rowRenderer = application => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${application.id}`)
      }
    >
      {application.name}
    </span>,
    application.providerName,
    application.description ? application.description : EMPTY_TEXT_PLACEHOLDER,
    <ScenariosDisplay scenarios={application.labels.scenarios || []} />,
    <Counter>{application.apiDefinitions.totalCount}</Counter>,
    <Counter>{application.eventDefinitions.totalCount}</Counter>,
    <StatusBadge
      status={
        application.status && application.status.condition
          ? application.status.condition
          : 'UNKNOWN'
      }
    />,
  ];

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        handleDelete(
          'Application',
          entry.id,
          entry.name,
          this.props.deleteApplication,
          this.props.applications.refetch,
        );
      },
    },
  ];

  render() {
    const applicationsQuery = this.props.applications;

    const applications =
      (applicationsQuery &&
        applicationsQuery.applications &&
        applicationsQuery.applications.data) ||
      {};
    const loading = applicationsQuery && applicationsQuery.loading;
    const error = applicationsQuery && applicationsQuery.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const extraHeaderContent = (
      <Popover
        body={
          <Menu>
            <Menu.List>
              <CreateApplicationModal
                applicationsQuery={applicationsQuery}
                modalOpeningComponent={<Menu.Item>From scratch</Menu.Item>}
              />
              <CreateApplicationFromTemplateModal
                applicationsQuery={applicationsQuery}
                modalOpeningComponent={<Menu.Item>From template</Menu.Item>}
              />
            </Menu.List>
          </Menu>
        }
        control={<Button option="light">Create application...</Button>}
        widthSizingType="matchTarget"
        placement="bottom-end"
      />
    );

    return (
      <>
        <PageHeader title="Applications" />
        <GenericList
          extraHeaderContent={extraHeaderContent}
          actions={this.actions}
          entries={applications}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
        />
      </>
    );
  }
}

export default Applications;
