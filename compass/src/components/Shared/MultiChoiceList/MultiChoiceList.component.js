import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown, Icon } from '@kyma-project/react-components';
import { Menu } from 'fundamental-react';
import './style.scss';

MultiChoiceList.propTypes = {
  placeholder: PropTypes.string,
  updateItems: PropTypes.func.isRequired,
  currentlySelectedItems: PropTypes.array.isRequired,
  currentlyNonSelectedItems: PropTypes.array.isRequired,
  notSelectedMessage: PropTypes.string,
  noEntitiesAvailableMessage: PropTypes.string,
  displayPropertySelector: PropTypes.string,
};

MultiChoiceList.defaultProps = {
  placeholder: 'Choose items...',
  noEntitiesAvailableMessage: 'No more entries available',
};

export default function MultiChoiceList({
  placeholder,
  currentlySelectedItems,
  currentlyNonSelectedItems,
  updateItems,
  notSelectedMessage,
  noEntitiesAvailableMessage,
  displayPropertySelector,
}) {
  const [selectedItems, setSelectedItems] = React.useState(
    currentlySelectedItems,
  );
  const [nonSelectedItems, setNonselectedItems] = React.useState(
    currentlyNonSelectedItems,
  );

  function getDisplayName(item) {
    return displayPropertySelector ? item[displayPropertySelector] : item;
  }

  function selectItem(item) {
    const newSelectedItems = [...selectedItems, item];
    const newNonSelectedItems = nonSelectedItems.filter(i => i !== item);

    updateLists(newSelectedItems, newNonSelectedItems);
  }

  function unselectItem(item) {
    const newSelectedItems = selectedItems.filter(i => i !== item);
    const newNonSelectedItems = [...nonSelectedItems, item];

    updateLists(newSelectedItems, newNonSelectedItems);
  }

  function updateLists(newSelectedItems, newNonSelectedItems) {
    setSelectedItems(newSelectedItems);
    setNonselectedItems(newNonSelectedItems);

    updateItems(newSelectedItems, newNonSelectedItems);
  }

  function createAssignedEntitiesList() {
    const selectedEntitiesList = (
      <ul>
        {selectedItems.map(item => (
          <li
            className="multi-choice-list__list-element"
            key={getDisplayName(item)}
          >
            <span>{getDisplayName(item)}</span>
            <Button
              option="light"
              type="negative"
              onClick={() => unselectItem(item)}
            >
              <Icon size="l" glyph="decline" />
            </Button>
          </li>
        ))}
      </ul>
    );

    return selectedItems.length ? selectedEntitiesList : notSelectedMessage;
  }

  function createNonChoosenEntitiesDropdown() {
    const nonChoosenItemsList = nonSelectedItems.map(item => (
      <Menu.Item onClick={() => selectItem(item)}>
        {getDisplayName(item)}
      </Menu.Item>
    ));

    return (
      <Dropdown
        control={
          <Button dropdown>
            <span>
              {nonSelectedItems.length
                ? placeholder
                : noEntitiesAvailableMessage}
            </span>
          </Button>
        }
        placement="bottom"
      >
        {nonChoosenItemsList}
      </Dropdown>
    );
  }

  return (
    <section className="multi-choice-list-modal__body">
      {createAssignedEntitiesList()}
      {createNonChoosenEntitiesDropdown()}
    </section>
  );
}
