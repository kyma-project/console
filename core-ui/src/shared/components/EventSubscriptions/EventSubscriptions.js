import React from 'react';
import PropTypes from 'prop-types';

import { GenericList } from 'react-shared';
import { EVENT_TRIGGERS_PANEL, ERRORS } from '../../constants';
import CreateEventSubscriptionModal from './CreateEventSubscriptionModal';

const textSearchProperties = ['metadata.name', 'spec.protocol']; //TODO add filtering by eventType

export default function EventSubscriptions({
  subscriptions = [],
  isLambda = false,
  serverDataError,
  serverDataLoading,
  onSubscriptionAdd,
  onSubscriptionDelete,
  notFoundMessage = EVENT_TRIGGERS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND,
}) {
  const actions = [
    {
      name: 'Delete',
      handler: onSubscriptionDelete,
    },
  ];

  const headerRenderer = _ => ['Event Type', 'Name', 'Protocol'];
  const rowRenderer = subscription => [
    subscription.spec.filter.filters[0]?.eventType.value,
    subscription.metadata.name,
    subscription.spec.protocol || '-',
  ];

  const createModal = (
    <CreateEventSubscriptionModal
      isLambda={isLambda}
      onSubmit={onSubscriptionAdd}
    />
  );

  return (
    <div>
      <GenericList
        title={EVENT_TRIGGERS_PANEL.LIST.TITLE}
        showSearchField={true}
        textSearchProperties={textSearchProperties}
        showSearchSuggestion={false}
        extraHeaderContent={createModal}
        actions={actions}
        entries={subscriptions}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataError={serverDataError}
        serverDataLoading={serverDataLoading}
        notFoundMessage={notFoundMessage}
        noSearchResultMessage={
          EVENT_TRIGGERS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
        }
        serverErrorMessage={ERRORS.SERVER}
      />
    </div>
  );
}

EventSubscriptions.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  serverDataError: PropTypes.any,
  serverDataLoading: PropTypes.bool,
  onSubscriptionAdd: PropTypes.func.isRequired,
  onSubscriptionDelete: PropTypes.func.isRequired,
};
