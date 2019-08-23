const { importSchema } = require('graphql-import');
const { ApolloServer, gql } = require('apollo-server');
const labelDefinitionQueries = require('./metadataDefinitions.mock.js');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
// const typeDefs = gql`
//   # Comments in GraphQL are defined with the hash (#) symbol.

//   # This "Book" type can be used in other type declarations.
//   type Runtime {
//     name: String
//     description: String
//   }

//   # The "Query" type is the root of all GraphQL queries.
//   # (A "Mutation" type will be covered later on.)
//   type Query {
//     runtimes: [Runtime]
//   }
// `;

const typeDefs = importSchema(
  '/Users/i354699/Sites/kyma-incubator/compass/components/director/pkg/graphql/schema.graphql',
);
// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    ...labelDefinitionQueries,
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: 1234 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
