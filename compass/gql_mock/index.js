const { importSchema } = require('graphql-import');
const { ApolloServer } = require('apollo-server');

const labelDefinitionQueries = require('./metadataDefinitions.mock.js');

const typeDefs = importSchema(`${__dirname}/schema.graphql`);

const resolvers = {
  Pageable: {
    __resolveType() {
      return null;
    },
  },
  CredentialData: {
    __resolveType() {
      return null;
    },
  },
  Query: {
    ...labelDefinitionQueries.Query,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

server.listen({ port: 1234 }).then(({ url }) => {
  console.log('\x1b[35m', `🚀  Mock GraphQL server ready at ${url}`);
});
