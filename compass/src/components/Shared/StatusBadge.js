import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'fundamental-react/lib/Badge';

class StatusBadge extends React.Component {
  PropTypes = {
    status: PropTypes.string,
  };

  processStatus() {
    const { status } = this.props;
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

  render = () => (
    this.processStatus()
  );
}

export default StatusBadge