import gql from 'graphql-tag';

const resolvers = {
  Query: {
    notification: (_, args, { cache }) => {
      console.log('notification lo');
    },
  },
  Mutation: {
    sendNotification: (_, args, { cache }) => {
      const notification = {
        ...args,
        visible: true,
        __typename: 'Notification',
      };

      console.log('sendNotification done', notification);
      cache.writeData({
        data: {
          notification,
        },
      });
      console.log('sendNotification cache', cache);
      return notification;
    },
    clearNotification: (_, args, { cache }) => {
      const notification = cache.readQuery({
        query: gql`
          query notification {
            notification @client {
              title
              content
              color
              icon
              visible
            }
          }
        `,
      }).notification;

      cache.writeData({
        data: {
          notification: {
            ...notification,
            visible: false,
          },
        },
      });
      return null;
    },
  },
};

export default resolvers;
