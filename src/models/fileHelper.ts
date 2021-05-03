import {DataBaseConnection} from './databaseConnection';
import * as config from '../../public/config.json';
import path from 'path';

export interface IFile {
    category: string;
    name: string;
}

export class FileHelper {
    public static allLoadedFiles: IFile[] = [];

    public static onStartup() {
        const fs = require('fs');
        fs.readdir(config.dev.repo, (err: any, files: any[]) => {
            if (err)
                throw new Error(err);

            files.forEach((category: string) => {
                fs.lstat(config.dev.repo + '\\' + category, async (err: any, stats: any) => {
                    if (err)
                        throw new Error(err);

                    let fullPath = '';
                    // Catogorised images
                    if (stats.isDirectory()) {
                        fs.readdir(config.dev.repo + '\\' + category, (err: any, files: any[]) => {
                            if (err)
                                throw new Error(err);

                            files.forEach(async (image: string) => {
                                fullPath = path.resolve(config.dev.repo + '\\' + category, image);
                                const imageName = image.split('.').slice(0, -1).join('.');
                                await DataBaseConnection.findOrAddImage(imageName, fullPath, category);
                                // this.allAlbums.push(category);
                                this.allLoadedFiles.push({category, name: imageName})
                            });
                            console.log(`${files.length} files loaded from ${category}`);
                        });
                    }
                    // Uncategorised images
                    else {
                        fullPath = path.resolve(config.dev.repo + '\\' + category);
                        const imageName = category.split('.').slice(0, -1).join('.');
                        await DataBaseConnection.findOrAddImage(category.split('.').slice(0, -1).join('.'), fullPath);
                        this.allLoadedFiles.push({category: '', name: imageName})
                    }
                });
            });
        });

    }

    public static getAllAlbums() {
        return new Set(this.allLoadedFiles.map(file => file.category));
    }
}