import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import * as nodemailer from "https://raw.githubusercontent.com/nodemailer/nodemailer/master/lib/nodemailer.js"
import { config } from "../common.ts";
export default class Mail {
  protected to: string = '';
  protected from: string = '';
  protected sender: string = '';
  protected subject: string = '';
  protected html: string = '';

  protected mailPort: number = 25;
  protected mailHost: string = '';
  protected mailTls: boolean = false;
  protected mailUser: string = '';
  protected mailPassword: string = '';

  constructor() {
    this.mailPort = config.mail.port;
    this.mailHost = config.mail.host;
    this.mailTls = config.mail.tls;
    this.mailUser = config.mail.user;
    this.mailPassword = config.mail.password;
  }

  public setTo(to: string) {
    this.to = to;
  }

  public setFrom(from: string) {
    this.from = from;
  }

  public setSender(sender: string) {
    this.sender = sender;
  }

  public setSubject(subject: string) {
    this.subject = subject;
  }

  public setHtml(html: string) {
    this.html = html;
  }

  public async send(auth = {}): Promise<string> {
    const client = new SmtpClient();

    if(this.mailTls) {    
      await client.connectTLS({
        hostname: this.mailHost,
        port: this.mailPort,
        username: this.mailUser,
        password: this.mailPassword,
        ...auth
      });
    } else {
      await client.connect({
        hostname: this.mailHost,
        port: this.mailPort,
        username: this.mailUser,
        password: this.mailPassword,
        ...auth
      });
    }
    

    const mailOptions: any = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      content: this.html,
    };

    await client.send(mailOptions);
    await client.close()
    return 'Mail Sent'
    
  }
}
