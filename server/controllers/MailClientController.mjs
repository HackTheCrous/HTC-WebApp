import Imap from 'node-imap';
import {simpleParser} from 'mailparser';
import dotenv from 'dotenv';
import MailModel from "../models/MailModel.mjs";

import events from 'events';

dotenv.config();

export default class MailClientController {

    constructor() {
        this.emitter = new events.EventEmitter();
    }

    /**
     * get all mails from the mailbox
     * @param fetchCommand
     * @param callback
     * @returns {Promise<unknown>} a promise that will resolve with an array of MailModel
     */
    async getMails(fetchCommand, callback) {
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
        let attributes;

        const mailRequest = {
            mails : [],
            attributes : [],
            nbMails : 1
        }

        return new Promise((resolve, reject) => {
            imap.once('ready', function () {
                imap.status('INBOX', (err, box) => {
                    if (err) throw err;
                    unseen = box.messages.unseen;
                });
                imap.openBox('INBOX', true, function (err, box) {
                    if (err) throw err;

                    let parsedFetchCommand = fetchCommand.replaceAll('LATEST', box.messages.total);
                    let evalFetch = parsedFetchCommand.match(/\(([^()]+)\)/g);

                    if (evalFetch !== null) {
                        for(const evalFetchElement of evalFetch){
                            parsedFetchCommand = parsedFetchCommand.replace(evalFetchElement, eval(evalFetchElement));
                        }
                    }


                    if(parsedFetchCommand.includes(':')){
                        mailRequest.nbMails = eval(parsedFetchCommand.replace(':', '-')) +1;
                    }


                    console.log(parsedFetchCommand);
                    let f = imap.seq.fetch(parsedFetchCommand, {
                        bodies: '',
                        struct: true
                    });
                    f.on('message', function (msg, seqno) {
                        let prefix = '(#' + seqno + ')';
                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            let count = 0;
                            simpleParser(stream, (err, mail) => {
                                mailRequest.nbMails--;
                                mailRequest.mails.push(mail);
                                if(mailRequest.nbMails === 0){
                                    const toResolve= [];
                                    for(let i=0; i<mailRequest.mails.length; i++){
                                        toResolve.push(callback(mailRequest.mails[i], mailRequest.attributes[i]));
                                    }
                                    resolve(toResolve);
                                }
                            });


                        });
                        msg.once('attributes', (attrs) => {
                            mailRequest.attributes.push(attrs);
                            attributes = attrs;
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

            imap.once('error', function (err) {
                reject(err);
            });


            imap.connect();
        });
    }

    async getLatestMail() {
        const mails = await this.getMails('LATEST', (mail, attributes) => {
            return new MailModel(mail.from.text, mail.to.text, mail.cc !== undefined ? mail.cc.text : false, mail.subject, mail.date, attributes.flags, mail.text, mail.html, mail.attachments);
        });
        return mails[0];
    }

    async getLatestMails(range) {
        return await this.getMails(`LATEST:(LATEST-${range-1})`, (mail, attributes) => {
            return new MailModel(mail.from.text, mail.to.text, mail.cc !== undefined ? mail.cc.text : false, mail.subject, mail.date, attributes.flags, mail.text, mail.html, mail.attachments);
        });
    }


}
