import DatabaseManager from "./DatabaseManager.mjs";
import UserModel from "./UserModel.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import {GraphQLLocalStrategy} from "graphql-passport";


export default class UserController {
    static async create(mail, password) {
        const client = DatabaseManager.getConnection();
        console.log("Inserting user: " + mail + " " + "password");
        await client.connect();
        await client.query('INSERT INTO radulescut.user(mail, password) values ($1, $2)', [mail, password]);

        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND password = $2', [mail, password]);

        await client.end();

        console.log("Inserted : " + response.rows[0].iduser + " " + response.rows[0].mail + " " + response.rows[0].password)
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }


    static getLocalStrategy() {
        return new LocalStrategy({usernameField: 'mail', passwordField : 'password'},function verify(mail, password, done){
            console.log("Local strategy "+ mail + " " + password);
            const client = DatabaseManager.getConnection();
            return client.connect().then(() => {
                client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND password = $2', [mail, password]).then((response) => {
                    const rows = response;
                    client.end().then(() => {
                        if (rows.rowCount === 0) {
                            console.log("Incorrect credentials "+ JSON.stringify(rows));
                            return done(null, false, {message: "Incorrect credentials"});
                        }
                        console.log("good");
                        return done(null, rows.rows[0]);
                    });
                });
            });
        });
    }

    static async get(iduser){
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE iduser = $1', [iduser]);
        await client.end();
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }


}