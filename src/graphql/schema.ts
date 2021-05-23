import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
const typeDefs = `
    type Query {
        albums: [String]
    }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });