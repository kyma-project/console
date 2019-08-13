import ServiceBrokers from './ServiceBrokers/resolvers';

export default {
  Query: {
    ...ServiceBrokers.Query,
  },
};
