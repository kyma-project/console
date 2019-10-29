import React from 'react';
import PropTypes from 'prop-types';
import { Counter } from 'fundamental-react/Badge';
import LuigiClient from '@kyma-project/luigi-client';

import CreateApplicationModal from './CreateApplicationModal/CreateApplicationModal.container';
import StatusBadge from '../Shared/StatusBadge/StatusBadge';
import GenericList from '../../shared/components/GenericList/GenericList';
import { EMPTY_TEXT_PLACEHOLDER } from '../../shared/constants';
import handleDelete from '../../shared/components/GenericList/actionHandlers/simpleDelete';
import LabelsDisplay from './../Shared/LabelDisplay';

class Applications extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
  };

  headerRenderer = applications => [
    'Name',
    'Description',
    'Labels',
    'APIs',
    'EventAPIs',
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
    application.description ? application.description : EMPTY_TEXT_PLACEHOLDER,
    application.labels && Object.keys(application.labels).length ? (
      <LabelsDisplay labels={application.labels} />
    ) : (
      EMPTY_TEXT_PLACEHOLDER
    ),
    <Counter>{application.apis.totalCount}</Counter>,
    <Counter>{application.eventAPIs.totalCount}</Counter>,
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

  // console.log(applications[0].labels)
  // applications[0].labels = {
  //   ...applications[0].labels,
  //   test: []
  // }
  // console.log(applications[0].labels)

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

    return (
      <GenericList
        extraHeaderContent={
          <CreateApplicationModal applicationsQuery={applicationsQuery} />
        }
        title="Applications"
        description="List of all aplications"
        actions={this.actions}
        entries={applications}
        headerRenderer={this.headerRenderer}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

export default Applications;
