const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { typeDefs: Book, resolvers: bookResolvers } = require('./book');
const { typeDefs: User, resolvers: userResolvers } = require('./user');
const { typeDefs: Token, resolvers: tokenResolvers } = require('./token');
const { typeDefs: Author, resolvers: authorResolvers } = require('./author');

const Query = `
  type Query {
    _empty: String
  }
`;
const Mutation = `
  type Mutation {
    _empty: String
  }
`;
const Subscription = `
  type Subscription {
    _empty: String
  }
`;
const resolvers = {};

module.exports = makeExecutableSchema({
  typeDefs: [Query, Mutation, Subscription, Book, User, Token, Author],
  resolvers: merge(
    resolvers,
    bookResolvers,
    userResolvers,
    tokenResolvers,
    authorResolvers
  ),
});
