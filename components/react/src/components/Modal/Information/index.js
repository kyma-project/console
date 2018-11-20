import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../index';

class InformationModal extends React.Component {
  static propTypes = {
    title: PropTypes.any.isRequired,
    content: PropTypes.any.isRequired,
    footer: PropTypes.any,
    modalOpeningComponent: PropTypes.any,
    width: PropTypes.string,
    headerAdditionalInfo: PropTypes.string,
  };

  static defaultProps = {
    title: 'Modal',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      content,
      footer,
      modalOpeningComponent,
      width,
      headerAdditionalInfo,
    } = this.props;

    return (
      <Modal
        title={title}
        content={content}
        footer={footer}
        modalOpeningComponent={modalOpeningComponent}
        width={width}
        headerAdditionalInfo={headerAdditionalInfo}
      />
    );
  }
}

export default InformationModal;
