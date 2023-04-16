import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export default class DatabaseManager{

    static getConnection(){
        const clientInfo  ={
            user: 'radulescut',
            password: process.env.PASSWORD,
            host: '162.38.222.142',
            port: 5673,
            database: 'iut'
        };
        return new Client(clientInfo);
    }
}