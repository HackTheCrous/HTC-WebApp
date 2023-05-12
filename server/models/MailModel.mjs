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

    mapToGraphQL(){
        return {
            from: this.from,
            to: this.to,
            cc: this.cc,
            subject: this.subject,
            date: this.date,
            tags: this.tags,
            text: this.text,
            html: this.html,
        };
    }
    setFlags(flags){
        this.flags = flags;
    }
}