import DatabaseManager from "./DatabaseManager.mjs";
import UserModel from "./UserModel.js";

export default class UserController{
    static async create(mail, password){
        const client = DatabaseManager.getConnection();

        await client.connect();
        await client.query('INSERT INTO radulescut.user(mail, password) values ($1, $2)', [mail, password]);

        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND password = $2', [mail, password]);

        await client.end();
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }
}