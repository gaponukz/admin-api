import mongoose, { Model } from 'mongoose'
import { Message } from '../../domain/entities'
import { MessageRepository } from '../../domain/repositories'
import { MessageDocument } from './mongodb/documents'
import { MessageSchema } from './mongodb/schemas'

export class MongoMessageRepository implements MessageRepository {
    private mongoMessage: Model<MessageDocument>

    constructor() {
        this.mongoMessage = mongoose.model<MessageDocument>('Message', MessageSchema)
    }

    async create(message: Message): Promise<void> {
        const newMessage = new this.mongoMessage(message)
        await newMessage.save()
    }

    async all(): Promise<Message[]> {
        const messages = await this.mongoMessage.find()

        return messages.map(message => new Message(
            message.subject,
            message.gmail,
            message.message,
            message.date
        ))
    }
}
