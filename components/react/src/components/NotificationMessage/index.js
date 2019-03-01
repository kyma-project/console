import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'styled-components-grid';

import Header from '../Header';
import Separator from '../Separator';
import Icon from '../Icon';

import {
  MessageWrapper,
  GridWrapper,
  CenterSideWrapper,
  ContentWrapper,
  ContentHeader,
  InfoIcon,
  ContentDescription,
  Element,
} from './components';

class NotificationMessage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: props.title && props.type && props.message,
    };
  }

  handleHide = () => {
    this.setState({ show: false });
  };

  componentWillReceiveProps = () => {
    this.setState({ show: true });
  };

  render() {
    const { type, title, message } = this.props;
    const { show } = this.state;

    if (!type || !title || !message) {
      return null;
    }
    return (
      <MessageWrapper>
        {show ? (
          <GridWrapper>
            <Grid.Unit>
              <CenterSideWrapper>
                <ContentWrapper>
                  <ContentHeader>
                    <Grid>
                      <Grid.Unit size={0.9}>
                        <Header>{title}</Header>
                      </Grid.Unit>
                      <Grid.Unit size={0.1}>
                        <InfoIcon onClick={this.handleHide}>
                          <Icon glyph="decline" />
                        </InfoIcon>
                      </Grid.Unit>
                    </Grid>
                  </ContentHeader>
                  <Separator />
                  <ContentDescription>
                    <Element>{message}</Element>
                  </ContentDescription>
                </ContentWrapper>
              </CenterSideWrapper>
            </Grid.Unit>
          </GridWrapper>
        ) : null}
      </MessageWrapper>
    );
  }
}

export default NotificationMessage;
