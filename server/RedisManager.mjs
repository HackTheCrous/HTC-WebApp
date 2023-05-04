import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();


export default class RedisManager{
    static getClient(){
        return createClient({
            url: `redis://milou666:${process.env.PASSWORD}@${process.env.REDIS_SERVER}`
        })
    }
}