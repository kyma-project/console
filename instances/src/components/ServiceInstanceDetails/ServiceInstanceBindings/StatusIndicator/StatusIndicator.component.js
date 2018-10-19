import React, { Fragment } from 'react';

import { statusColor } from '../../../../commons/helpers';
import { StatusWrapper, Status } from './styled';

class StatusIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      statuses: this.countByType(),
    };
  }

  countByType = usage => {
    if (!this.props.data) return;
    let statusCounts = {};
    const statusTypes = this.props.data
      .map(item => item.status.type)
      .filter((type, index, array) => array.indexOf(type) === index);

    for (let type of statusTypes) {
      statusCounts[type] = this.props.data.filter(
        item => item.status.type === type,
      ).length;
    }
    return statusCounts;
  };

  render() {
    const { statuses } = this.state;
    let statusType;

    if (statuses && statuses.FAILED) {
      statusType = 'FAILED';
    } else if (statuses && (statuses.PENDING || statuses.UNKNOWN)) {
      statusType = 'PENDING';
    }
    return (
      <Fragment>
        {statusType && (
          <StatusWrapper backgroundColor={statusColor(statusType)}>
            <Status>{statuses[statusType]}</Status>
          </StatusWrapper>
        )}
      </Fragment>
    );
  }
}

export default StatusIndicator;
