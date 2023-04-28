import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

import dotenv from "dotenv";

dotenv.config({
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env")
});

export default class MailService {

    static async sendConfirmationMail(to, nonce, name) {
        const subject = "Confirm your account";
        const pathToConfirm = path.join(path.dirname(fileURLToPath(import.meta.url)), "../view/confirm.html");
        const link = process.env.CLIENT_URL + "/register/confirmation/" + nonce;
        fs.readFile(pathToConfirm, "utf8", (err, html) => {
            if (err) {
                console.log(err);
            }
            html = html.replace("{{ username }}", name);
            console.log(link);
            html = html.replace("{{ link }}", link);
            this.sendMail(to, subject, `Confirme ton compte à l'addresse : ${link} `, html);
        });
    }

    static async sendMail(to, subject, text, html) {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const info = await transporter.sendMail({
            from: '"hack The cr*us" <noreply@hackthecrous.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }


}

