import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

export default class MailService {
  static async sendConfirmationMail(to, nonce, name) {
    const subject = "Hack The crous - Confirme ton compte";
    let html =
      "<header>\n" +
      "  <h1>Hack The cr*us - Confirme ton compte !</h1>\n" +
      "</header>\n" +
      "<main>\n" +
      "  <p>\n" +
      "    Hello ! <br>\n" +
      "    Voici le code de confirmation de ton compte Hack The Crous<br>\n" +
      '    <b>{{ code }}</b>\n' +
      "    Si tu n'as pas créé de compte, ignore ce mail.\n" +
      "  </p>\n" +
      "</main>\n";

    html = html.replace("{{ username }}", name);
    html = html.replace("{{ code }}", nonce);
    await this.sendMail(
      to,
      subject,
      `Confirme ton compte Hack The Crous avec le code ${nonce} `,
      html
    );
  }

  static async sendMail(to, subject, text, html) {
    const testAccount = await nodemailer.createTestAccount();

    console.log("sending an email");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hackthecrus@gmail.com",
        pass: "repwtevfxuhbezkt",
      },
    });
    /*
        const transporter = nodemailer.createTransport({
            service: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
    
      });*/
  
    const info = await transporter.sendMail({
      from: '"hack The cr*us" <noreply@hackthecrous.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
