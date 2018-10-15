import ServiceInstances from './ServiceInstances/resolvers';
import ServiceInstanceDetails from './ServiceInstanceDetails/resolvers';
import Filter from './Filter/resolvers';
import Notification from './Notification/resolvers';

export default {
  Query: {
    ...Filter.Query,
    ...ServiceInstanceDetails.Query,
  },
  Mutation: {
    ...ServiceInstances.Mutation,
    ...ServiceInstanceDetails.Mutation,
    ...Filter.Mutation,
    ...Notification.Mutation,
  },
};
