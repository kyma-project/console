import React from 'react';

import EventApiDetailsHeader from './EventApiDetailsHeader/EventApiDetailsHeader'
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';

function EventApiDetails({ applicationQuery, deleteEventApi, eventApiId }) {

  //This is a temporary solution. Rewrite once 'eventApi' query is ready.
  const application = (applicationQuery && applicationQuery.application) || {};
  const loading = applicationQuery.loading;
  const error = applicationQuery.error;
  if (!applicationQuery || !applicationQuery.application) {
    if (loading) return 'Loading...';
    if (error) {
    //fix resource not found component
      return (
        <ResourceNotFound resource="Application" breadcrumb="Applications" />
      );
    }
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  let eventApi;
  if (application && application.eventAPIs && application.eventAPIs.data && application.eventAPIs.data.length) {
    const eventApis = application.eventAPIs.data;
    eventApi = eventApis.find(a => (a.id === eventApiId));
    if (!eventApi) {
      return (
        <ResourceNotFound resource="Event Api"/>
      );
    }
  }

  return (
    <>
      <EventApiDetailsHeader application={application} eventApi={eventApi} deleteEventApi={deleteEventApi}></EventApiDetailsHeader>
      <DocumentationComponent></DocumentationComponent>
    </>
  );
}

export default EventApiDetails;
