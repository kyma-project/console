import Notification from "./Notification/resolvers";

export default {
  Query: {},
  Mutation: {
    ...Notification.Mutation
  }
};
