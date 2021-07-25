const {
  UserInputError,
  AuthenticationError,
} = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const Book = require('../models/book');
const Author = require('../models/author');

const pubsub = new PubSub();

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  extend type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
  }

  extend type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }

  extend type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: (root, args) => {
      const filter = {};
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      return Book.find(filter).populate('author');
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const { title, published, genres } = args;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      try {
        let author = await Author.findOneAndUpdate(
          { name: args.author },
          { $inc: { bookCount: 1 } },
          { new: true }
        );

        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({ title, published, genres, author });
        await book.save();

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

module.exports = { typeDefs, resolvers };
