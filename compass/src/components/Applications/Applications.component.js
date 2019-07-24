import React from 'react';
import PropTypes from 'prop-types';
import { Token } from 'fundamental-react/lib/Token';
import { Badge, Counter } from 'fundamental-react/lib/Badge';

import LuigiClient from '@kyma-project/luigi-client';
import GenericList from '../../shared/components/GenericList/GenericList';
import CreateApplicationModal from './CreateApplicationModal/CreateApplicationModal.container';

class Applications extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
  };

  createLabels = labels => {
    const separatedLabels = [];
    for (const key in labels) {
      if (labels.hasOwnProperty(key) && labels[key].length > 0) {
        labels[key].forEach(lab => {
          if (lab === 'undefined') {
            separatedLabels.push(key);
          } else {
            separatedLabels.push(key + '=' + lab);
          }
        });
      }
    }
    return separatedLabels.map((label, id) => (
      <Token
        key={id}
        className="y-fd-token y-fd-token--no-button y-fd-token--gap"
      >
        {label}
      </Token>
    ));
  };

  processStatus(status) {
    let type = 'warning';
    switch (status) {
      case 'INITIAL':
        return <Badge>{status}</Badge>;

      case 'READY':
        type = 'success';
        break;
      case 'UNKNOWN':
        type = 'warning';
        break;
      case 'FAILED':
        type = 'error';
        break;
      default:
        type = 'warning';
    }

    return <Badge type={type}>{status}</Badge>;
  }

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
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate(`/applications/details/${application.id}`)
      }
    >
      <b>{application.name}</b>
    </span>,
    application.description,
    application.labels ? this.createLabels(application.labels) : '-',
    <Counter>{application.apis.totalCount}</Counter>,
    <Counter>{application.eventAPIs.totalCount}</Counter>,
    this.processStatus(application.status.condition),
  ];

  handleDelete = async element => {
    try {
      await this.props.deleteApplication(element.id);
      this.refreshApplications();
    } catch (e) {
      LuigiClient.uxManager().showAlert({
        text: `Error occored during deletion ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  refreshApplications = () => {
    this.props.applications.refetch();
  };

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: 'Remove application',
            body: `Are you sure you want to delete application "${entry.name}"?`,
            buttonConfirm: 'Delete',
            buttonDismiss: 'Cancel',
          })
          .then(() => {
            this.handleDelete(entry);
          })
          .catch(() => {});
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
