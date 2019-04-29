import React from 'react';

interface Props {
  text: string;
}

const InlineHelp: React.FunctionComponent<Props> = ({ text }) => (
  <span className="fd-inline-help fd-has-float-right">
    <span className="fd-inline-help__content fd-inline-help__content--bottom-left">
      {text}
    </span>
  </span>
);

export default InlineHelp;
