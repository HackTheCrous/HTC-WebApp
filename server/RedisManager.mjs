import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();


export default class RedisManager{
    static getClient(){
        const client = createClient({
            socket: {
                host: process.env.REDIS_SERVER,
                port: '10562'
            },
            username: 'milou666',
            password : process.env.PASSWORD
        });

        client.on('error', err => console.error('Redis Server Error', err))
        
       return client;
    }
}
