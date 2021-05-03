import { DataBaseConnection } from "../models/databaseConnection";
import { FileHelper } from "../models/fileHelper";

export const resolvers = {
    Query: {
        hello: async () => {
            try {
                // const res = await DataBaseConnection.findOrAddImage('Hello2', '1025');
            } catch (error) {
                console.log('resolver error', error);

            }
            return 'Hello OWLR'
        },
        getAlbums: async () => {
            try {
                // return await DataBaseConnection.getAlbums();
                return FileHelper.getAllAlbums();
            } catch (error) {
                console.log('Error getting albums');
                throw new Error(error);
            }
        }
    }
}