import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModelHeaderWrapper = styled.section`
  && {
    display: flex;
    align-items: center;
  }
`;

const Wrapper = styled.div`
  && {
    display: block;
  }
`;

const ModelToggle = styled.span`
  && {
    top: 1px;
  }
`;

const CodeWrapper = styled.section`
  && {
    border-radius: 4px;
    border: ${props => (props.expanded ? 'solid 1px #89919a' : 'none')};
    background-color: #fafafa;
    table.model {
      width: unset;
    }
  }
`;

export const ModelCollapse = (_, system) =>
  class ModelCollapse extends Component {
    static propTypes = {
      collapsedContent: PropTypes.any,
      expanded: PropTypes.bool,
      children: PropTypes.any,
      title: PropTypes.element,
      modelName: PropTypes.string,
      classes: PropTypes.string,
      onToggle: PropTypes.func,
      hideSelfOnExpand: PropTypes.bool,
    };

    static defaultProps = {
      collapsedContent: '{...}',
      expanded: false,
      title: null,
      onToggle: () => {},
      hideSelfOnExpand: false,
    };

    constructor(props, context) {
      super(props, context);

      let { expanded, collapsedContent } = this.props;

      this.state = {
        expanded: expanded,
        collapsedContent:
          collapsedContent || ModelCollapse.defaultProps.collapsedContent,
      };
    }

    componentDidMount() {
      const { hideSelfOnExpand, expanded, modelName } = this.props;
      if (hideSelfOnExpand && expanded) {
        // We just mounted pre-expanded, and we won't be going back..
        // So let's give our parent an `onToggle` call..
        // Since otherwise it will never be called.
        this.props.onToggle(modelName, expanded);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.expanded !== nextProps.expanded) {
        this.setState({ expanded: nextProps.expanded });
      }
    }

    toggleCollapsed = () => {
      if (this.props.onToggle) {
        this.props.onToggle(this.props.modelName, !this.state.expanded);
      }

      this.setState({
        expanded: !this.state.expanded,
      });
    };

    render() {
      console.log(system);
      const { title, classes } = this.props;

      if (this.state.expanded) {
        if (this.props.hideSelfOnExpand) {
          return <span className={classes || ''}>{this.props.children}</span>;
        }
      }

      return (
        <Wrapper className={classes || ''}>
          <ModelHeaderWrapper>
            {title && (
              <span
                onClick={this.toggleCollapsed}
                style={{ cursor: 'pointer' }}
              >
                {title}
              </span>
            )}
            <span onClick={this.toggleCollapsed} style={{ cursor: 'pointer' }}>
              <ModelToggle
                className={
                  'model-toggle' + (this.state.expanded ? '' : ' collapsed')
                }
              />
            </span>
          </ModelHeaderWrapper>

          <CodeWrapper expanded={this.state.expanded}>
            {this.state.expanded
              ? this.props.children
              : this.state.collapsedContent}
          </CodeWrapper>
        </Wrapper>
      );
    }
  };
