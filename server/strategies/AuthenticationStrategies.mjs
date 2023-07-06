import LocalStrategy from "passport-local";
import UserModel from "../models/UserModel.mjs";
import UserController from "../controllers/UserController.js";
import { Strategy } from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import DatabaseManager from "../DatabaseManager.mjs";
import bcrypt from "bcrypt";

export default class AuthenticationStrategies {
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
            .query("SELECT iduser, mail, password FROM users WHERE mail = $1", [
              mail,
            ])
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

  static getJWTStrategy(options) {
    return new Strategy(options, function verify(jwt_payload, done) {
      const client = DatabaseManager.getConnection();
      return client.connect().then(() => {
        client
          .query("SELECT iduser, mail, password FROM users WHERE iduser = $1", [
            jwt_payload.id,
          ])
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

  static getGoogleStrategy() {
    return new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
        scope: ["email"],
        state: true,
      },
      function verify(accessToken, refreshToken, email, done) {
        const client = DatabaseManager.getConnection();
        console.log("-------");
        console.log(email);
        console.log("triggered");
        return client.connect().then(() => {
          client
            .query(
              "SELECT iduser, mail FROM users u JOIN federated_credentials f ON u.iduser=f.user_id WHERE u.mail=$1 and f.provider=$2",
              [email.emails[0].value, "https://accounts.google.com"]
            )
            .then((response) => {
              const rows = response;
              if (rows.rowCount === 0) {
                console.log("subscription triggered");
                const nonce = UserController.genVerificationCode();
                const refreshToken = UserController.genRefreshToken();

                client
                  .query(
                    "INSERT INTO users(mail, nonce, token) values ($1, $2, $3) RETURNING iduser, mail",
                    [email.emails[0].value, nonce, refreshToken]
                  )
                  .then((response) => {
                    const rows = response;
                    client
                      .query(
                        "INSERT INTO federated_credentials(user_id, provider) values ($1, $2)",
                        [rows.rows[0].iduser, "https://accounts.google.com"]
                      )
                      .then(() => {
                        console.log(rows);
                        client.end().then(() => {
                          const user = new UserModel(
                            rows.rows[0].iduser,
                            rows.rows[0].mail,
                            "",
                            "",
                            0,
                            "",
                            ""
                          );
                          return done(null, user.getSerialized());
                        });
                      });
                  });
              } else {
                console.log("user logged in");
                const user = new UserModel(
                  rows.rows[0].iduser,
                  rows.rows[0].mail,
                  "",
                  "",
                  0,
                  "",
                  ""
                );
                console.log(user);
                return done(null, user.getSerialized());
              }
            });
        });
      }
    );
  }
}
