import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const grapQLSchema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
    hello: () => 'Hello World!'

};
const app = express();
const port = 3000;
app.use(
    '/Graphql',
    graphqlHTTP({
      schema: grapQLSchema,
      rootValue: root,
      graphiql: true,
    }),
  );

app.listen(port);