import Imap from 'node-imap';
import { inspect } from 'util';
import {simpleParser} from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();
class MailClientController {
    static async getMails() {
        console.log(process.env.MAIL_USERNAME)
        const imap = new Imap({
            user: process.env.MAIL_USERNAME,
            password: process.env.MAIL_PASSWORD,
            host: 'mail.etu.umontpellier.fr',
            port: 993,
            tls: true
        });

        let unseen;

        imap.once('ready', function() {
            imap.status('INBOX', (err, box) => {
               if(err) throw err;
               unseen = box.messages.unseen;
            });
            imap.openBox('INBOX', true, function(err, box) {
                if(err) throw err;
                console.log(box.messages.total + ' messages in INBOX');

                let f = imap.seq.fetch(`${box.messages.total-3}`, {
                    bodies: '',
                    struct: true
                });
                f.on('message', function(msg, seqno) {
                    console.log('Message #%d', seqno);
                    let prefix = '(#' + seqno + ')';
                    msg.on('body', (stream, info) => {
                        let buffer = '';
                        let count = 0;
                        simpleParser(stream, (err, mail) => {
                           console.log(mail.to);
                        });

                    });

                    msg.once('end', () => {
                        console.log(prefix + 'Finished');
                    });
                });
                f.once('error', (err) => {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', () => {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });

        imap.once('error', function(err) {
            console.log(err);
        });

        imap.once('end', () => {
            console.log('Connection ended');
        })

        imap.connect();
    }
}

MailClientController.getMails();