import React from 'react';
import PropTypes from 'prop-types';

import { Panel, Search } from '@kyma-project/react-components';
import NamespaceFilters from './NamespaceFilters/NamespaceFilters';
import './NamespacesListHeader.scss';

import ModalWithForm from '../../ModalWithForm/ModalWithForm';
import CreateNamespaceForm from '../../CreateNamespaceForm/CreateNamespaceForm';

NamespacesListHeader.propTypes = {
  labelFilters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  updateSearchPhrase: PropTypes.func.isRequired,
  setLabelFilters: PropTypes.func.isRequired,
};

export default function NamespacesListHeader({
  labelFilters,
  updateSearchPhrase,
  setLabelFilters,
}) {
  return (
    <div>
      {' '}
      {/* wrap in div to remove .fd-panel::after */}
      <Panel className="namespace-list-header fd-has-padding-medium">
        <span className="fd-has-type-4">Namespaces</span>
        <div className="namespace-list-actions">
          <Search
            onChange={e => updateSearchPhrase(e.target.value)}
            data-test-id="namespace-seach-input"
          />
          <NamespaceFilters
            filters={labelFilters}
            updateFilters={setLabelFilters}
          />
          <ModalWithForm
            title="Add new namespace"
            button={{ text: 'Add new namespace', glyph: 'add' }}
            id="add-namespace-modal"
            renderForm={props => <CreateNamespaceForm {...props} />}
          />
        </div>
      </Panel>
    </div>
  );
}
