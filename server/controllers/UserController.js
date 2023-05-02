import DatabaseManager from "../DatabaseManager.mjs";
import UserModel from "../models/UserModel.js";
import LocalStrategy from "passport-local";

import {Strategy} from "passport-jwt";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import SchoolModel from "../models/SchoolModel.mjs";
import RestaurantModel from "../models/RestaurantModel.mjs";
import RestaurantController from "./RestaurantController.mjs";
import MailService from "../services/MailService.mjs";

dotenv.config();


export default class UserController {

    /**
     * @param mail
     * @param password clear password
     * @returns {Promise<UserModel>} returns only the iduser, mail and password because the other fields are not needed at this step
     */
    static async create(mail, password) {
        const client = DatabaseManager.getConnection();

        const salt = await bcrypt.genSalt(parseInt(process.env.HASH_ROUND));

        const hashed = await bcrypt.hash(password, salt);

        await client.connect();

        const nonce = UserController.genNonce();


        await client.query('INSERT INTO radulescut.user(mail, password, nonce) values ($1, $2, $3)', [mail, hashed, nonce]);

        MailService.sendConfirmationMail(mail, nonce, mail.split('@')[0]).then(() => {
            console.log("Mail sent");
        });

        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND password = $2', [mail, hashed]);

        await client.end();

        console.log("Inserted : " + response.rows[0].iduser + " " + response.rows[0].mail + " " + response.rows[0].password)
        return new UserModel(response.rows[0].iduser, response.rows[0].mail, response.rows[0].password);
    }

    static async confirm(mail, nonce) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT iduser, mail, password FROM radulescut.user WHERE mail = $1 AND nonce = $2', [mail, nonce]);
        if (response.rowCount === 0) {
            return false;
        }
        await client.query('UPDATE radulescut.user SET nonce = NULL WHERE mail = $1', [mail]);
        await client.end();
        return true;
    }

    static genNonce() {
        const size = 32;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
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


                        if (!bcrypt.compareSync(password, rows.rows[0].password)) {
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
        const response = await client.query('SELECT iduser FROM radulescut.user WHERE mail = $1', [mail]);
        await client.end();
        return response.rowCount > 0;
    }

    static async getMail(mail) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT ' + UserModel.getHeaders() + ' FROM radulescut.user WHERE mail = $1', [mail]);
        await client.end();
        return UserModel.buildUser(response.rows[0]);
    }

    static async get(iduser) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query('SELECT ' + UserModel.getHeaders() + ' FROM radulescut.user WHERE iduser = $1', [iduser]);
        await client.end();
        if (response.rowCount === 0) {
            return null;
        }
        return UserModel.buildUser(response.rows[0]);
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


    static async getSchool(iduser) {
        const query = "SELECT s.idschool, s.name, s.coords FROM radulescut.School s JOIN radulescut.User u ON u.idschool = s.idschool WHERE u.iduser = $1";
        const params = [iduser];
        const client = DatabaseManager.getConnection();
        await client.connect();
        const result = await client.query(query, params);
        await client.end();
        if (result.rowCount === 0) {
            return null;
        }
        return new SchoolModel(result.rows[0].idschool, result.rows[0].name, result.rows[0].coords);
    }


    /**
     * Update the user's name, school and ical and insert into favoriterestaurant the restaurants
     * @param iduser the id of the user to modify
     * @param name the new name
     * @param school the new school
     * @param ical the new ical link
     * @param restaurants a list of restaurants id's to insert into favoriterestaurant
     * @returns {Promise<UserModel>} true if the user was modified, false otherwise
     */
    static async modify(iduser, name, school, ical, restaurants) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        if(restaurants != null){
            await client.query('DELETE FROM radulescut.favoriterestaurant WHERE iduser = $1', [iduser]);

            for (const restaurant of restaurants) {
                await client.query('INSERT INTO radulescut.favoriterestaurant(iduser, idrestaurant) VALUES ($1, $2)', [iduser, restaurant]);
            }
        }

        await client.query('UPDATE radulescut.user SET name = $1, idschool = $2, ical = $3 WHERE iduser = $4', [name, school, ical, iduser]);
        await client.end();
    }

    static async getFavoriteRestaurants(iduser) {
        const query = 'select r.' + RestaurantModel.getHeaders() + ' FROM radulescut.restaurant r JOIN radulescut.favoriterestaurant fr on r.idrestaurant = fr.idrestaurant WHERE fr.iduser = $1';
        const params = [iduser];

        const client = DatabaseManager.getConnection();
        await client.connect();
        const response = await client.query(query, params);
        await client.end();
        return response.rows.map((row) => {
            return RestaurantModel.buildRestaurant(row);
        });
    }

    static async like(idrestaurant, iduser) {
        const query = 'insert into favoriterestaurant(idrestaurant, iduser) values ($1, $2)';
        const params = [parseInt(idrestaurant), parseInt(iduser)];

        const client = DatabaseManager.getConnection();
        await client.connect();
        await client.query(query, params);
        await client.end();

        return UserController.getFavoriteRestaurants(iduser);
    }

    static async dislike(idrestaurant, iduser) {
        const query = 'delete from favoriterestaurant where idrestaurant=$1 and iduser=$2';
        const params = [idrestaurant, iduser];

        const client = DatabaseManager.getConnection();
        await client.connect();
        await client.query(query, params);
        await client.end();
        return UserController.getFavoriteRestaurants(iduser);
    }
}