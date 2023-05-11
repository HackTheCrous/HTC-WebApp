export default class MailModel{
    constructor(from, to, cc, subject, date, tags, text, html, attachments){
        this.from = from;
        this.to = to;
        this.cc = cc;
        this.subject = subject;
        this.date = date;
        this.tags = tags;
        this.text = text;
        this.html = html;
        this.attachments = attachments;
    }
    setFlags(flags){
        this.flags = flags;
    }
}