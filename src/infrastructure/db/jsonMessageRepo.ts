import fs from 'fs'
import { Message } from '../../domain/entities'
import { MessageRepository } from '../../domain/repositories'

export class JsonMessageRepository implements MessageRepository {
    private filename: string

    constructor(filename: string) {
        this.filename = filename
    }

    create(message: Message): void {
        const messages = this.getAllMessages()
        messages.push(message)
        fs.writeFileSync(this.filename, JSON.stringify(messages))
    }

    all(): Message[] {
        return this.getAllMessages();
    }

    private getAllMessages(): Message[] {
        try {
            const data = fs.readFileSync(this.filename, 'utf8')
            return JSON.parse(data);
        } catch (error) {
            return []
        }
    }
}
