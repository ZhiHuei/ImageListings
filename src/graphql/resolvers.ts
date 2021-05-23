import { DataBaseConnection } from "../models/databaseConnection";
import { FileHelper } from "../models/fileHelper";

export const resolvers = {
    Query: {
        albums: async () => {
            try {
                return FileHelper.getAllAlbums();
            } catch (error) {
                console.log('Error getting albums');
                throw new Error(error);
            }
        }
    }
}