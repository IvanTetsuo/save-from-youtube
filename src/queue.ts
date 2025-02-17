import {ConnectionOptions, Queue} from 'bullmq';

const url = process.env.REDIS_CONNECT_URL;
if (!url) {
    throw new Error('Empty Redis connect URL')
}
const objUrl = new URL(url);
export const connectionOptions = {
    family: 0,
    username: objUrl.username,
    password: objUrl.password,
    port: +objUrl.port,
    host: objUrl.hostname,
};
export const videoDownloadingQueue = new Queue('videos downloading', {connection: connectionOptions});
export const videoRemovalQueue = new Queue('videos removal', {connection: connectionOptions});