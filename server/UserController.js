import DatabaseManager from "./DatabaseManager.mjs";
import UserModel from "./UserModel.js";
import passport from "passport";
import LocalStrategy from "passport-local";

import {Strategy} from "passport-jwt";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
import bcrypt from "bcrypt";

dotenv.config();


export default class UserController {
    static async create(mail, password) {
        const client = DatabaseManager.getConnection();

        const salt = await bcrypt.genSalt(parseInt(process.env.HASH_ROUND));

        const hashed = await bcrypt.hash(password, salt);

        await client.connect();


        await client.query('INSERT INTO radulescut.user(mail, password) values ($1, $2)', [mail, hashed]);

        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND password = $2', [mail,hashed]);

        await client.end();

        console.log("Inserted : " + response.rows[0].iduser + " " + response.rows[0].mail + " " + response.rows[0].password)
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }


    static getLocalStrategy() {
        return new LocalStrategy({
            usernameField: 'mail',
            passwordField: 'password'
        }, function verify(mail, password, done) {
            const client = DatabaseManager.getConnection();
            return client.connect().then(() => {
                client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1', [mail]).then((response) => {


                    const rows = response;

                    client.end().then(() => {
                        if (rows.rowCount === 0) {
                            return done(null, false, {message: "Incorrect credentials"});
                        }


                        if(!bcrypt.compareSync(password, rows.rows[0].password)){
                            return done(null, false, {message: "Incorrect credentials"});
                        }
                        return done(null, rows.rows[0]);
                    });
                });
            });
        });
    }


    static getJWTStrategy(options) {
        return new Strategy(options, function verify(jwt_payload, done) {
            const client = DatabaseManager.getConnection();
            return client.connect().then(() => {
                client.query('SELECT iduser, mail, password FROM radulescut.user WHERE iduser = $1', [jwt_payload.id]).then((response) => {
                    const rows = response;
                    client.end().then(() => {
                        if (rows.rowCount === 0) {
                            return done(null, false, {message: "Incorrect credentials"});
                        }
                        return done(null, rows.rows[0]);
                    });
                });
            });
        });
    }

    static async checkIfUserExists(mail) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1', [mail]);
        await client.end();
        return response.rowCount > 0;
    }

    static async getMail(mail){
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1', [mail]);
        await client.end();
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }

    static async get(iduser) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT iduser, mail, password, name FROM radulescut.user WHERE iduser = $1', [iduser]);
        await client.end();
        if(response.rowCount === 0){
            return null;
        }
        let user = new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
        user.name = response.rows[0].name;
        return user;
    }

    static genJWT({id, mail}) {
        let token;
        try {
            token = jwt.sign(
                {id, mail},
                process.env.JWT_SECRET,
                {expiresIn: "3h"}
            );
        } catch (err) {
            console.log(err);
        }
        return token;
    }


}