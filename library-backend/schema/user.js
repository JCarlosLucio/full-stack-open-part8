const { UserInputError } = require('apollo-server-express');
const User = require('../models/user');

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(username: String!, favoriteGenre: String!): User
  }
`;

const resolvers = {
  Query: {
    me: (root, args, { currentUser }) => currentUser,
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        const savedUser = await user.save();
        return savedUser;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
