import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar, Breadcrumb, Panel } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';

EntryNotFound.propTypes = {
  entryType: PropTypes.string.isRequired,
  entryId: PropTypes.string,
  navigate: PropTypes.func,
};

export default function EntryNotFound({ entryType, entryId, navigate }) {
  const navigateToList = () => {
    navigate
      ? navigate()
      : LuigiClient.linkManager()
          .fromClosestContext()
          .navigate('');
  };

  return (
    <>
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none">
          <section>
            <Breadcrumb>
              <Breadcrumb.Item
                name={`${entryType}s`}
                url="#"
                onClick={() => navigateToList()}
              />
              <Breadcrumb.Item />
            </Breadcrumb>
            <ActionBar.Header title={entryId || 'Loading name...'} />
          </section>
        </section>
      </header>
      <Panel className="fd-has-padding-regular fd-has-margin-regular">
        {entryType} "{entryId}" doesn't exist.
      </Panel>
    </>
  );
}
