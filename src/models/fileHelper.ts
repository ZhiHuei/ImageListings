import { DataBaseConnection } from './databaseConnection';
import * as config from '../../public/config.json';
import path from 'path';
import fs from 'fs';

export interface IFile {
    category: string;
    name: string;
}
// Ambitious Plan: insert the details into db only through the user upload or interrupt to detect file changes using worker thread. 
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
                                await DataBaseConnection.findOrAddImage(imageName, fullPath, category);
                                this.allLoadedFiles.push({ category, name: imageName })
                            });
                            console.log(`${files.length} files loaded from ${category}`);
                        });
                    }
                    // Uncategorised images
                    else {
                        const imageName = category.split('.').slice(0, -1).join('.');
                        await DataBaseConnection.findOrAddImage(category.split('.').slice(0, -1).join('.'), categoryPath);
                        this.allLoadedFiles.push({ category: '', name: imageName })
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