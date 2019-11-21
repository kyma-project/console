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
  function getDisplayName(item) {
    return displayPropertySelector ? item[displayPropertySelector] : item;
  }

  function selectItem(item) {
    const newSelectedItems = [...currentlySelectedItems, item];
    const newNonSelectedItems = currentlyNonSelectedItems.filter(
      i => i !== item,
    );

    updateItems(newSelectedItems, newNonSelectedItems);
  }

  function unselectItem(item) {
    const newSelectedItems = currentlySelectedItems.filter(i => i !== item);
    const newNonSelectedItems = [...currentlyNonSelectedItems, item];

    updateItems(newSelectedItems, newNonSelectedItems);
  }

  function createSelectedEntitiesList() {
    if (!currentlySelectedItems.length) {
      return <p className="fd-has-font-style-italic">{notSelectedMessage}</p>;
    }

    return (
      <ul>
        {currentlySelectedItems.map(item => (
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
  }

  function createNonSelectedEntitiesDropdown() {
    if (!currentlyNonSelectedItems.length) {
      return (
        <p className="fd-has-font-style-italic">{noEntitiesAvailableMessage}</p>
      );
    }

    const nonChoosenItemsList = currentlyNonSelectedItems.map(item => (
      <Menu.Item
        onClick={() => {
          selectItem(item);
        }}
      >
        {getDisplayName(item)}
      </Menu.Item>
    ));

    return (
      <Dropdown
        control={
          <Button dropdown typeAttr="button">
            <span>{placeholder}</span>
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
      {createSelectedEntitiesList()}
      {createNonSelectedEntitiesDropdown()}
    </section>
  );
}
