import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Labels, PageHeader, LabelSelectorInput } from './../..';
import { Icon } from 'fundamental-react';
import './HeaderLabelsEditor.scss';

HeaderLabelsEditor.propTypes = {
  labels: PropTypes.object.isRequired,
  onApply: PropTypes.func.isRequired,
  columnSpan: PropTypes.string,
};

export function HeaderLabelsEditor({
  labels: originalLabels,
  onApply,
  columnSpan,
}) {
  const [isEditing, setEditing] = React.useState(false);
  const [editedLabels, setEditedLabels] = React.useState(originalLabels);

  const applyEdit = () => {
    setEditing(false);
    onApply(editedLabels);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedLabels(originalLabels);
  };

  const labelEditor = (
    <section style={{ gridColumn: columnSpan }}>
      <LabelSelectorInput labels={editedLabels} onChange={setEditedLabels} />
      <div className="header-label-editor__actions">
        <span className="link fd-has-type-0" onClick={applyEdit}>
          Apply
        </span>
        <span className="link fd-has-type-0" onClick={cancelEdit}>
          Cancel
        </span>
      </div>
    </section>
  );

  const labelsTitle = (
    <>
      <span>Labels</span>
      <span className="fd-has-display-inline-block fd-has-margin-left-tiny cursor-pointer">
        <Tooltip content="Edit labels" position="top">
          <Icon
            glyph="edit"
            aria-label="Edit labels"
            onClick={() => setEditing(true)}
          />
        </Tooltip>
      </span>
    </>
  );

  const staticLabels = (
    <PageHeader.Column title={labelsTitle} columnSpan={columnSpan}>
      <Labels labels={originalLabels} />
    </PageHeader.Column>
  );

  return isEditing ? labelEditor : staticLabels;
}
