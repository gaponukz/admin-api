import { Message } from '../../domain/entities'
import { CreateMessageDTO } from '../dto'
import { MessageRepository } from '../../domain/repositories'

export interface MessageNotifier {
    send(message: Message): void
}

export class MessageService {
    private repo: MessageRepository
    private notifier: MessageNotifier

    constructor(repo: MessageRepository, notifier: MessageNotifier) {
        this.repo = repo
        this.notifier = notifier
    }

    create(data: CreateMessageDTO): void {
        const date = new Date((new Date()).toUTCString()) 
        const message = new Message(data.subject, data.gmail, data.message, date) 

        this.repo.create(message)
        this.notifier.send(message)
    }

    all(): Message[] {
        return this.repo.all()
    }
}