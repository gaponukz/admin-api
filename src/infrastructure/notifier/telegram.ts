import { Message } from './../../domain/entities'
import { MessageNotifier } from '../../application/usecases/messageService'

class TelegramNotifier implements MessageNotifier {
    private telegramBotToken: string
    private ownerID: string

    constructor(telegramBotToken: string, ownerID: string) {
        this.telegramBotToken = telegramBotToken
        this.ownerID = ownerID
    }

    send(message: Message): void {
        const telegramApiUrl = "https://api.telegram.org/bot"
        const apiAction = "sendMessage"
        const text = this.formatMessage(message)

        fetch(`${telegramApiUrl}${this.telegramBotToken}/${apiAction}?chat_id=${this.ownerID}}&text=${text}`)
    }

    private formatMessage(message: Message): string {
        return `${message.message} \n${message.subject} \n${message.gmail}`
    }
}
