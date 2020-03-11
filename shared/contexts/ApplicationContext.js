import React, { createContext, useContext, Component } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { isEqual } from 'lodash';

const watchedProperties = ['tenantId', 'idToken'];

export const ApplicationContext = createContext({});

export class ApplicationContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = { context: LuigiClient.getContext() };

    LuigiClient.addInitListener(this.updateContext);
    LuigiClient.addContextUpdateListener(this.updateContext);
  }

  hasPropertyChanged = ctx => {
    return watchedProperties.some(
      property => !isEqual(ctx[property], this.state.context[property]),
    );
  };

  updateContext = ctx => {
    if (this.hasPropertyChanged(ctx)) {
      this.setState({ context: ctx });
    }
  };

  render() {
    return (
      <ApplicationContext.Provider value={this.state.context}>
        {this.props.children}
      </ApplicationContext.Provider>
    );
  }
}

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

export const withApplicationContext = Component => props => (
  <ApplicationContext.Consumer>
    {value => <Component {...props} context={value} />}
  </ApplicationContext.Consumer>
);
