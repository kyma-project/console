import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ErrorWrapper } from './styled';

class ErrorBoundary extends Component {
  static propTypes = {
    content: PropTypes.any.isRequired,
    children: PropTypes.element.isRequired,
  };

  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    const { children, content } = this.props;
    const { hasError } = this.state;

    if (hasError) return <ErrorWrapper>{content}</ErrorWrapper>;
    return children;
  }
}

export default ErrorBoundary;
