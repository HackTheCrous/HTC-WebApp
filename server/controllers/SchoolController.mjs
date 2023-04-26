import DatabaseManager from "../DatabaseManager.mjs";
import SchoolModel from "../models/SchoolModel.mjs";

export default class SchoolController {
    static async getSchooLike(name) {
        let query = "SELECT idschool, name, coords FROM school WHERE UPPER(name) LIKE $1";
        let params = ["%" + name.toUpperCase() + "%"];

        const client = DatabaseManager.getConnection();

        await client.connect();
        let result = await client.query(query, params);
        await client.end();
        return result.rows.map(row => new SchoolModel(row.idschool, row.name, row.coords));
    }

    static async create(name){
        let query = "INSERT INTO school(name) VALUES($1)";
        let params = [name];

        const client = DatabaseManager.getConnection();

        await client.connect();
        await client.query(query, params);
        await client.end();
    }
}