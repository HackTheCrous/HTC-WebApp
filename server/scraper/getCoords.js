//script to write in a json files crous restaurants' names

import pkg from 'pg';
const { Client } = pkg;
import dotenv from "dotenv";

import { appendFileSync } from "fs";

dotenv.config();

const getConnection = () => {
    const clientInfo = {
        user: 'radulescut',
        password: process.env.PASSWORD,
        host: '162.38.222.142',
        port: 5673,
        database: 'iut'
    };
    return new Client(clientInfo);
}

const getRestaurantNames = async () => {
    const client = getConnection();

    await client.connect();
    const result = await client.query('SELECT name from radulescut.restaurant');
    await client.end();

    return result.rows.map(row => row.name);
}


const saveInCsv= (restaurants) => {
    let csvToWrite = "";
    for(const restaurant of restaurants){
        csvToWrite+= restaurant + "\n"
    }
    csvToWrite = csvToWrite.substring(0,csvToWrite.length-1);
    try{
        appendFileSync("./restaurants.csv", csvToWrite);
    }catch (err){
        console.error(err);
    }
}

getRestaurantNames().then(restaurants => saveInCsv(restaurants));

