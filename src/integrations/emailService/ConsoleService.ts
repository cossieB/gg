import type { EmailOptions, EmailService } from "./emailService.interface";
export class ConsoleService implements EmailService {
    public readonly sentEmails: EmailOptions[] = []
    sendMail(opts: EmailOptions): Promise<void> {
        console.log(opts.text)        
        this.sentEmails.push(opts);
        return Promise.resolve()
    }
    async clear() {
        this.sentEmails.length = 0
    }
    getLatestVerificationLink(): string | null {
        const lastEmail = this.sentEmails.at(-1);
        if (!lastEmail || !lastEmail.text) return null;

        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = lastEmail.text.match(urlRegex);

        return match ? match[0] : null;
    }
}

