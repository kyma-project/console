import React from 'react';
import PropTypes from 'prop-types';

import { Panel, Button, Search } from '@kyma-project/react-components';
import NamespaceFilters from './NamespaceFilters/NamespaceFilters';
import './NamespacesListHeader.scss';

NamespacesListHeader.NamespacesListHeader = {
  labelFilters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  updateSearchPhrase: PropTypes.func.isRequired,
  setLabelFilters: PropTypes.func.isRequired,
};

export default function NamespacesListHeader({
  updateSearchPhrase,
  labelFilters,
  setLabelFilters,
}) {
  return (
    <Panel className="namespace-list-header fd-has-padding-medium remove-after">
      <span className="fd-has-type-4">Namespaces</span>
      <div className="namespace-list-actions">
        <Search onChange={e => updateSearchPhrase(e.target.value)} />
        <NamespaceFilters
          filters={labelFilters}
          updateFilters={setLabelFilters}
        />
        <Button glyph="add">Create Namespace</Button>
      </div>
    </Panel>
  );
}
