import * as config from '../../public/config.json';

export const getConfig = () => {
    if (process.env.NODE_ENV === 'docker') {
        return config.docker;
    } else if (process.env.NODE_ENV === 'dev') {
        return config.dev;
    }
}