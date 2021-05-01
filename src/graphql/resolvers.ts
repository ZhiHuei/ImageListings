import { DataBaseConnection } from "../models/databaseConnection";

export const resolvers = {
    Query: {
        hello: async () => {
            try {
                const res = await DataBaseConnection.findOrAddImage('Hello2', '1025');
            } catch (error) {
                console.log('resolver error', error);

            }
            return 'Hello OWLR'
        }
    }
}