import { DataBaseConnection } from './databaseConnection';
import * as config from '../../public/config.json';
import path from 'path';
import fs from 'fs';
import { errorHandler } from '../models/errorHandler';

export interface IFile {
    category: string;
    name: string;
}
// TODO: Watcher to update files status
export class FileHelper {
    public static allLoadedFiles: IFile[] = [];

    public static onStartup() {
        fs.readdir(config.dev.repo, (err: any, files: any[]) => {
            if (err)
                throw new Error(err);

            files.forEach((category: string) => {
                const categoryPath = path.resolve(config.dev.repo, category);

                fs.lstat(categoryPath, async (err: any, stats: any) => {
                    if (err)
                        throw new Error(err);

                    let fullPath = '';
                    // Catogorised images
                    if (stats.isDirectory()) {
                        fs.readdir(categoryPath, (err: any, files: any[]) => {
                            if (err)
                                throw new Error(err);

                            files.forEach(async (image: string) => {
                                fullPath = path.resolve(categoryPath, image);
                                const imageName = image.split('.').slice(0, -1).join('.');
                                DataBaseConnection.findOrAddImage(imageName, fullPath, category)
                                    .then(() => this.allLoadedFiles.push({ category, name: imageName }))
                                    .catch(err => errorHandler(err));
                            });
                            console.log(`${files.length} files loaded from ${category}`);
                        });
                    }
                    // Uncategorised images
                    else {
                        const imageName = category.split('.').slice(0, -1).join('.');
                        DataBaseConnection.findOrAddImage(category.split('.').slice(0, -1).join('.'), categoryPath)
                            .then(() => this.allLoadedFiles.push({ category: '', name: imageName }))
                            .catch(err => errorHandler(err));
                    }
                });
            });
        });
    }

    public static getAllAlbums() {
        return new Set(this.allLoadedFiles.map(file => file.category));
    }

    public static getAllPhotos(category: string) {
        return this.allLoadedFiles.filter(file => file.category == category).map(f => f.name);
    }
}