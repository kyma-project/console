import React from 'react';
import NotePanel from '../../NotePanel';

const BlockQuote = ({ children }) => {
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

  const createPanels = elem => {
    if (!elem) {
      return null;
    }
    return elem.map((element, index) => (
      <NotePanel type={getPanelType(element[0])} key={index}>
        {element}
      </NotePanel>
    ));
  };

  const panelTypes = ['note', 'caution', 'tip'];
  const isOneOfTypes = arg => !!arg && panelTypes.includes(arg);

  const modifiedChildren =
    Array.isArray(children) &&
    children.reduce((accumulator, curr) => {
      const currType = getPanelType(curr);
      if (isOneOfTypes(currType)) {
        return [...accumulator, [curr]];
      }
      const len = accumulator.length - 1;
      const newLastElement = [...accumulator[len], curr];
      return [...accumulator.slice(0, len), newLastElement];
    }, []);

  return modifiedChildren ? (
    <Fragment>{createPanels(modifiedChildren)}</Fragment>
  ) : null;
};
export default BlockQuote;
