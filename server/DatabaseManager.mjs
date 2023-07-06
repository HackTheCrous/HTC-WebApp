import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export default class DatabaseManager{
    static getConnection(){
        const clientInfo  ={
            user: 'Milou666',
            password: process.env.PASSWORD,
            host: 'ep-proud-recipe-896832.eu-central-1.aws.neon.tech',
            port: 5432,
            database: 'neondb',
            ssl: {
              mode: 'require',
              rejectUnauthorized: false,
            },
        };
        return new Client(clientInfo);
    }
}
