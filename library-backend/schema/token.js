const { UserInputError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');

const typeDefs = `
  type Token {
    value: String!
  }

  extend type Mutation {
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

module.exports = { typeDefs, resolvers };
