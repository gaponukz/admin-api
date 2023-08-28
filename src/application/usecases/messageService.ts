import { Message } from '../../domain/entities'
import { CreateMessageDTO } from '../dto'
import { MessageRepository } from '../../domain/repositories'

export interface MessageNotifier {
    send(message: Message): Promise<void>
}

export interface IMessageService {
    create(data: CreateMessageDTO): Promise<void>
    all(): Promise<Message[]>
}

export class MessageService implements IMessageService {
    private repo: MessageRepository
    private notifier: MessageNotifier

    constructor(repo: MessageRepository, notifier: MessageNotifier) {
        this.repo = repo
        this.notifier = notifier
    }

    async create(data: CreateMessageDTO): Promise<void> {
        const date = new Date((new Date()).toUTCString()) 
        const message = new Message(data.subject, data.gmail, data.message, date) 

        await this.repo.create(message)
        await this.notifier.send(message)
    }

    async all(): Promise<Message[]> {
        return await this.repo.all()
    }
}