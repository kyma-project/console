import React from 'react';
import styled, { css } from 'styled-components';

const buttonStyle = css`
  border-radius: 4px;
  border: solid 1px #0a6ed1;
  font-family: 72;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #0a6ed1;
  background-color: white;
`;

const SchemesWrapper = styled.section`
  && {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > section.schemes.wrapper.block {
      width: unset;
      margin: 0;
      padding-right: 10px;
      height: 36px;
      > label[for='schemes'] {
        margin: 0;
        & > select {
          width: 70px;
          height: 28px;
          ${buttonStyle}
          box-shadow: none;
        }
      }
    }
  }
`;

const ExpandButton = styled.button`
  ${buttonStyle}
  width: 83px;
  height: 29px;
`;

const Wrapper = styled.span`
  && {
    display: flex;
    justify-content: space-between;
  }
`;

const Text = styled.p`
  align-self: flex-start;
  font-family: 72;
  margin: 0;
  align-self: center;
  color: ${props => (props.light ? '#6a6d70' : '#32363a')};
  font-size: ${props => (props.light ? '14px' : '16px')};

  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: #32363a;
`;

export const ApiReferencePlugin = function(system) {
  return {
    wrapComponents: {
      parameters: (Original, system) => props => {
        const allowTryItOut = false;
        const customProps = { ...props, allowTryItOut };

        return <Original {...customProps} />;
      },
      authorizeBtn: (Original, system) => props => {
        return null;
      },
      authorizeOperationBtn: (Original, system) => props => {
        return null;
      },
      info: (Original, system) => props => {
        return null;
      },
      Col: (Orig, system) => props => {
        if (props.className === 'schemes wrapper') {
          return (
            <Wrapper>
              <Text>API Console</Text>
              <SchemesWrapper className="test">
                <Text light>Schemes</Text>
                <Orig {...props} />
                <ExpandButton>Expand All</ExpandButton>
              </SchemesWrapper>
            </Wrapper>
          );
        }
        return <Orig {...props} />;
      },
      OperationSummary: (Orig, system) => props => {
        return <Orig {...props} />;
      },
    },
  };
};

export const ApiConsolePlugin = function(system) {
  return {
    wrapComponents: {
      authorizeBtn: (Original, system) => props => {
        return null;
      },
      info: (Original, system) => props => {
        return null;
      },
      Col: (Orig, system) => props => {
        return <Orig {...props} />;
      },
    },
  };
};
