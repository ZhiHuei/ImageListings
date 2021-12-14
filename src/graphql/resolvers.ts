import { DataBaseConnection } from "../models/databaseConnection";
import { FileHelper } from "../models/fileHelper";

export const resolvers = {
    Query: {
        albums: async () => {
            return FileHelper.getAllAlbums();
        }
    }
}