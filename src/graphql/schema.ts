import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
const typeDefs = `
    type Query {
        hello: String
        albums: [String]
    }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });