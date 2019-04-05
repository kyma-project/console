import React, { Fragment } from 'react';
import NotePanel from '../../NotePanel';

function BlockQuote({ children }) {
  const getPanelType = child => {
    const type =
      child &&
      child.props &&
      child.props.children &&
      child.props.children[0] &&
      child.props.children[0].props.children[0] &&
      child.props.children[0].props.children[0].props &&
      child.props.children[0].props.children[0].props.value;

    return type && type.replace(':', '').toLowerCase();
  };

  const createPanels = elem =>
    elem.map((child, index) => (
      <NotePanel type={getPanelType(child)} key={index}>
        {child}
      </NotePanel>
    ));

  return children ? <Fragment>{createPanels(children)}</Fragment> : null;
}

export default BlockQuote;
