import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Labels, PageHeader, LabelSelectorInput } from './../..';
import { Button, Icon } from 'fundamental-react';
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
    <section className="header-label-editor" style={{ gridColumn: columnSpan }}>
      <LabelSelectorInput
        labels={editedLabels}
        onChange={setEditedLabels}
        showLabel={false}
      />
      <Button
        glyph="accept"
        type="positive"
        aria-label="Apply"
        onClick={applyEdit}
      />
      <Button
        glyph="decline"
        type="negative"
        aria-label="Cancel"
        onClick={cancelEdit}
      />
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
