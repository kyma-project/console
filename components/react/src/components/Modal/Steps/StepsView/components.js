import React from 'react';
import styled from 'styled-components';

export const StepWrapper = styled.div`
  flex-shrink: 0;
  display: block;
  height: 70px;
`;

export const StepLine = styled.div`
  height: 2px;
  width: 70%;
  opacity: 0.15;
  border-bottom: 2px dashed #4e5c67;
  position: absolute;
  top: 15px;
  left: 15%;
`;

export const Step = styled.div`
  height: auto;
  position: relative;
  right: 50%;
  transform: translate(50%, -50%);
`;

export const Circle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props =>
    (1 === props.step && !props.right && '#0a6bcc') ||
    (1 === props.step && props.right && '#ffffff') ||
    (2 === props.step && !props.right && '#ffffff') ||
    (2 === props.step && props.right && '#0a6bcc')};
  border: 2px solid
    ${props =>
      (1 === props.step && !props.right && '#0a6bcc') ||
      (1 === props.step && props.right && 'rgba(50, 54, 58, 0.5)') ||
      (2 === props.step && !props.right && '#3db350') ||
      (2 === props.step && props.right && '#0a6bcc')};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: normal;
  text-align: center;
  color: ${props =>
    (1 === props.step && !props.right && '#ffffff') ||
    (1 === props.step && props.right && 'rgba(50, 54, 58, 0.5)') ||
    (2 === props.step && !props.right && '#3db350') ||
    (2 === props.step && props.right && '#ffffff')};
  line-height: 30px;
  margin: 0 50px;
  position: absolute;
  right: ${props => (props.right ? '0' : 'auto')};
`;

export const CircleText = styled.div`
  font-family: '72';
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  text-transform: uppercase;
  position: absolute;
  top: 40px;
  width: 95px;
  color: ${props =>
    (1 === props.step && !props.right && '#0a6bcc') ||
    (1 === props.step && props.right && 'rgba(50, 54, 58, 0.5)') ||
    (2 === props.step && !props.right && '#3db350') ||
    (2 === props.step && props.right && '#0a6bcc')};
  right: ${props => (props.right ? '20px' : 'auto')};
  left: ${props => (props.left ? '20px' : 'auto')};
`;
