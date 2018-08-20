import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../Icon';

import { StepWrapper, Step, Circle, CircleText, StepLine } from './components';

const Steps = ({ currentStage, firstText, secondText, secondNumber }) => (
  <StepWrapper>
    <Step>
      <Circle step={currentStage}>
        {currentStage === 1 ? '1' : <Icon icon={'\uE05B'} />}
      </Circle>
      <CircleText left step={currentStage}>
        {firstText}
      </CircleText>
      <StepLine />
      <Circle right step={currentStage}>
        {secondNumber}
      </Circle>
      <CircleText right step={currentStage}>
        {secondText}
      </CircleText>
    </Step>
  </StepWrapper>
);

Steps.propTypes = {
  currentStage: PropTypes.number.isRequired,
  firstText: PropTypes.string.isRequired,
  secondText: PropTypes.string.isRequired,
  secondNumber: PropTypes.number.isRequired,
};

export default Steps;
