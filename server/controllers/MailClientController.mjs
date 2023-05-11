import Imap from 'node-imap';
import { inspect } from 'util';
import {simpleParser} from 'mailparser';
import dotenv from 'dotenv';
import MailModel from "../models/MailModel.mjs";

import events from 'events';

dotenv.config();
class MailClientController {

    constructor() {
        this.emitter = new events.EventEmitter();
    }

     async getLatestMail(rank) {
        console.log(process.env.MAIL_USERNAME)
        const imap = new Imap({
            user: process.env.MAIL_USERNAME,
            password: process.env.MAIL_PASSWORD,
            host: 'mail.etu.umontpellier.fr',
            port: 993,
            tls: true
        });

        let unseen;
        let mailContainer;
        let flags;

        return new Promise((resolve, reject) => {
            imap.once('ready', function() {
                imap.status('INBOX', (err, box) => {
                    if(err) throw err;
                    unseen = box.messages.unseen;
                });
                imap.openBox('INBOX', true, function(err, box) {
                    if(err) throw err;

                    let f = imap.seq.fetch(`${box.messages.total-rank}`, {
                        bodies: '',
                        struct: true
                    });
                    f.on('message', function(msg, seqno) {
                        let prefix = '(#' + seqno + ')';
                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            let count = 0;
                            simpleParser(stream, (err, mail) => {
                                mailContainer = new MailModel(mail.from.text, mail.to.text , mail.cc!==undefined ? mail.cc.text : false , mail.subject, mail.date, flags, mail.text, mail.html, mail.attachments);
                                resolve(mailContainer);
                            });


                        });
                        msg.once('attributes', (attrs) => {
                            flags = attrs.flags;

                        });
                    });
                    f.once('error', (err) => {
                        reject(err);
                    });
                    f.once('end', () => {
                        imap.end();
                    });
                });
            });

            imap.once('error', function(err) {
                reject(err);
            });

            imap.once('end', () => {
                console.log('Connection ended');

            })

            imap.connect();
        });


    }
}

const mailGetter = new MailClientController();
mailGetter.getLatestMail(3).then((mail) => {
    console.log(mail);
});
