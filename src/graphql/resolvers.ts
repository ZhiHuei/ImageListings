import { DataBaseConnection } from "../models/databaseConnection";

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
                return await DataBaseConnection.getAlbums();
            } catch (error) {
                console.log('Error getting albums');
                throw new Error(error);
            }
        },
        getPhotos: async () => {
            try {
                // return await DataBaseConnection
                return "";
            } catch (error) {
                console.log('Error getting albums');
                throw new Error(error);
            }
        }
    }
}