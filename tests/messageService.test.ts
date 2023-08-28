import { Message } from '../src/domain/entities'
import { MessageService, MessageNotifier } from '../src/application/usecases/messageService'
import { MessageRepository } from '../src/domain/repositories'
import { CreateMessageDTO } from '../src/application/dto'

class MessageRepositoryMock implements MessageRepository {
    private messages: Message[]
    
    constructor() {
        this.messages = []
    }

    async create(message: Message): Promise<void> {
        this.messages.push(message)
    }

    async all(): Promise<Message[]> {
        return this.messages
    }
}

class NotifierMock implements MessageNotifier {
    private lastMessage: Message | undefined

    constructor() {
        this.lastMessage = undefined
    }

    async send(message: Message): Promise<void> {
        this.lastMessage = message
    }

    getLastMessage(): Message {
        if (!this.lastMessage) {
            throw new Error("ops")
        }

        return this.lastMessage
    }
}

describe('Test message sending', () => {
    const db = new MessageRepositoryMock()
    const notifier = new NotifierMock()
    const service = new MessageService(db, notifier)

    test('Create correct message without errors', async () => {
        const expectedMessage = new CreateMessageDTO("sub", "test@gmail.com", "hi")
        await service.create(expectedMessage)
        const message = notifier.getLastMessage()
        const dbMessage = (await service.all()).find(m => m.gmail === "test@gmail.com")
        
        expect(dbMessage).not.toBe(undefined)
        expect(expectedMessage.gmail).toBe(message.gmail)
        expect(expectedMessage.subject).toBe(message.subject)
        expect(expectedMessage.message).toBe(message.message)
    })
})