import DatabaseManager from "../DatabaseManager.mjs";
import UserModel from "../models/UserModel.js";
import LocalStrategy from "passport-local";

import { Strategy } from "passport-jwt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import SchoolModel from "../models/SchoolModel.mjs";
import RestaurantModel from "../models/RestaurantModel.mjs";
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

    const nonce = UserController.genVerificationCode();

    const refreshToken = UserController.genRefreshToken();

    console.log(refreshToken);

    await client.query(
      "INSERT INTO users(mail, password, nonce, token) values ($1, $2, $3, $4)",
      [mail, hashed, nonce, refreshToken]
    );

    const response = await client.query(
      "SELECT iduser, mail, password FROM users WHERE mail = $1 AND password = $2",
      [mail, hashed]
    );

    await client.end();

    return new UserModel(
      response.rows[0].iduser,
      response.rows[0].mail,
      response.rows[0].password,
      "",
      0,
      "",
      ""
    );
  }

  static async confirm(mail, nonce) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT iduser, mail, password FROM users WHERE mail = $1 AND nonce = $2",
      [mail, nonce]
    );
    if (response.rowCount === 0) {
      return false;
    }
    await client.query(
      "UPDATE users SET nonce = NULL WHERE mail = $1",
      [mail]
    );
    await client.end();
    return true;
  }

  static async sendConfirmationMail(iduser, firstname) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT mail, nonce FROM users WHERE iduser = $1",
      [iduser]
    );
    await client.end();
    const mail = response.rows[0].mail;
    const nonce = response.rows[0].nonce;
    try {
      // this error handling is giving me lowkey brain damage
      MailService.sendConfirmationMail(mail, nonce, firstname);
    } catch (e) {
      return false;
    }
    return true;
  }
  /**
   * generate a six digit code for the verification of the mail
   */
  static genVerificationCode() {
    const chars = "0123456789";
    let result = "";
    for (let i = 6; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  static genNonce(size = 32) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = size; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  static getLocalStrategy() {
    return new LocalStrategy(
      {
        usernameField: "mail",
        passwordField: "password",
      },
      function verify(mail, password, done) {
        const client = DatabaseManager.getConnection();
        return client.connect().then(() => {
          client
            .query(
              "SELECT iduser, mail, password FROM users WHERE mail = $1",
              [mail]
            )
            .then((response) => {
              const rows = response;

              client.end().then(() => {
                if (rows.rowCount === 0) {
                  return done(null, false, {
                    message: "Incorrect credentials",
                  });
                }

                if (!bcrypt.compareSync(password, rows.rows[0].password)) {
                  return done(null, false, {
                    message: "Incorrect credentials",
                  });
                }
                return done(null, rows.rows[0]);
              });
            });
        });
      }
    );
  }

  /**
   * Middleware to check if the given refresh token is valid
   **/
  static getRefreshTokenStrategy(req, res, next) {
    if (req.body.refreshToken === undefined) {
      return res.status(401).json({ message: "Invalid parameters" });
    }

    const client = DatabaseManager.getConnection();
    try {
      const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid signature" });
    }
    return client.connect().then(() => {
      client
        .query(
          "SELECT iduser, mail, password FROM users WHERE token = $1",
          [req.body.refreshToken]
        )
        .then((response) => {
          const rows = response;
          client.end().then(() => {
            if (rows.rowCount === 0) {
              return res.status(401).json({ message: "Invalid token" });
            }
            return next();
          });
        });
    });
  }

  static getJWTStrategy(options) {
    return new Strategy(options, function verify(jwt_payload, done) {
      const client = DatabaseManager.getConnection();
      return client.connect().then(() => {
        client
          .query(
            "SELECT iduser, mail, password FROM users WHERE iduser = $1",
            [jwt_payload.id]
          )
          .then((response) => {
            const rows = response;
            client.end().then(() => {
              if (rows.rowCount === 0) {
                return done(null, false, { message: "Incorrect credentials" });
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
    const response = await client.query(
      "SELECT iduser FROM users WHERE mail = $1",
      [mail]
    );
    await client.end();
    return response.rowCount > 0;
  }

  /**
   * @param mail
   * get user by mail
   */
  static async getMail(mail) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT " +
        UserModel.getHeaders() +
        " FROM users WHERE mail = $1",
      [mail]
    );
    await client.end();
    return UserModel.buildUser(response.rows[0]);
  }

  static async get(iduser) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT " +
        UserModel.getHeaders() +
        " FROM users WHERE iduser = $1",
      [iduser]
    );
    await client.end();
    if (response.rowCount === 0) {
      return null;
    }
    return UserModel.buildUser(response.rows[0]);
  }

  static async getIcal(iduser) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT ical FROM users WHERE iduser = $1",
      [iduser]
    );
    await client.end();
    if (response.rowCount === 0) {
      return null;
    }
    return response.rows[0].ical;
  }

  static async isNameUpdatable(iduser) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(
      "SELECT name_modified FROM users WHERE iduser = $1",
      [iduser]
    );
    await client.end();
    if (response.rowCount === 0) {
      return true;
    }

    return (
      new Date(response.rows[0].name_modified).getMonth() !==
        new Date().getMonth() &&
      new Date(response.rows[0].name_modified).getYear() !==
        new Date().getYear()
    );
  }

  /**
   * generate a new auth token which is a JWT token
   * @param id he user id in the database
   * @param mail the user mail
   */
  static genAuthToken({ id, mail }) {
    let token;
    try {
      token = jwt.sign({ id, mail }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
    } catch (err) {
      console.log(err);
    }
    return token;
  }

  static genRefreshToken() {
    let token;
    const nonce = UserController.genNonce(128);
    try {
      token = jwt.sign({ nonce }, process.env.JWT_SECRET, { expiresIn: "14d" });
    } catch (err) {
      console.log(err);
    }
    return token;
  }

  static async getSchool(iduser) {
    const query =
      "SELECT s.idschool, s.name, s.coords FROM School s JOIN users u ON u.idschool = s.idschool WHERE u.iduser = $1";
    const params = [iduser];
    const client = DatabaseManager.getConnection();
    await client.connect();
    const result = await client.query(query, params);
    await client.end();
    if (result.rowCount === 0) {
      return null;
    }
    return new SchoolModel(
      result.rows[0].idschool,
      result.rows[0].name,
      result.rows[0].coords
    );
  }

  static async modifyField(idUser, value, field) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    await client.query(
      "UPDATE users SET " + field + " = $1 WHERE iduser = $2",
      [value, idUser]
    );
    await client.end();
  }

  static async updateName(iduser, name) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    await client.query(
      "UPDATE users SET name = $1, name_modified = $2 WHERE iduser = $3",
      [name, new Date(), iduser]
    );
    await client.end();
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
    if (restaurants != null) {
      await client.query(
        "DELETE FROM favoriterestaurant WHERE iduser = $1",
        [iduser]
      );

      for (const restaurant of restaurants) {
        await client.query(
          "INSERT INTO favoriterestaurant(iduser, idrestaurant) VALUES ($1, $2)",
          [iduser, restaurant]
        );
      }
    }

    await client.query(
      "UPDATE users SET name = $1, idschool = $2, ical = $3 WHERE iduser = $4",
      [name, school, ical, iduser]
    );
    await client.end();
  }

  static async getFavoriteRestaurants(iduser) {
    const query =
      "select r." +
      RestaurantModel.getHeaders() +
      " FROM restaurant r JOIN favoriterestaurant fr on r.idrestaurant = fr.idrestaurant WHERE fr.iduser = $1";
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
    const query =
      "insert into favoriterestaurant(idrestaurant, iduser) values ($1, $2)";
    const params = [parseInt(idrestaurant), parseInt(iduser)];

    const client = DatabaseManager.getConnection();
    await client.connect();
    await client.query(query, params);
    await client.end();

    return UserController.getFavoriteRestaurants(iduser);
  }

  static async dislike(idrestaurant, iduser) {
    const query =
      "delete from favoriterestaurant where idrestaurant=$1 and iduser=$2";
    const params = [idrestaurant, iduser];

    const client = DatabaseManager.getConnection();
    await client.connect();
    await client.query(query, params);
    await client.end();
    return UserController.getFavoriteRestaurants(iduser);
  }

  static async checkNonce(iduser) {
    const query =
      "select count(iduser) as noncevalue FROM users where iduser=$1 and nonce is not null";
    const params = [iduser];

    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(query, params);
    await client.end();
    return response.rows[0].noncevalue === "0";
  }

  /**
   * get the refresh token of the user if it exists and is valid, otherwise generate a new one
   * @param iduser the id of the user
   * @returns {Promise<string>} the refresh token
   **/
  static async getRefreshToken(iduser) {
    const query =
      "select token FROM users where iduser=$1 and token is not null and token != ''";
    const params = [iduser];

    const client = DatabaseManager.getConnection();
    await client.connect();
    const response = await client.query(query, params);

    let refreshToken = response.rows[0].token;

    if (response.rowCount === 0) {
      refreshToken = UserController.genRefreshToken(iduser);
      await client.query(
        "update users set token=$1 where iduser=$2",
        [refreshToken, iduser]
      );
      await client.end();
      return refreshToken;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      refreshToken = UserController.genRefreshToken(iduser);
      await client.query(
        "update users set token=$1 where iduser=$2",
        [refreshToken, iduser]
      );
    }

    await client.end();
    return refreshToken;
  }

  static async updateRefreshToken(oldToken) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const refreshToken = UserController.genRefreshToken();
    try {
      await client.query("update users set token=$1 where token=$1", [
        refreshToken,
        oldToken,
      ]);
    }catch (err) {
      if(err.code === '23505') {
        await client.end();  
        return await UserController.updateRefreshToken(oldToken);//retry because of duplicate key
      }else{
        throw err;
      }
    }
    await client.end();
    return refreshToken;
  }
}
