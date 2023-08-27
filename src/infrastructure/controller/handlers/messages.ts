import { Request, Response } from 'express'
import { CreateMessageDTO } from './../../../application/dto'
import { IMessageService } from "../../../application/usecases/messageService"

export class MessageHandler {
    private service: IMessageService

    constructor(service: IMessageService) {
        this.service = service
    }

    sendMessage (request: Request, response: Response) {
        if (!(request.body.subject && request.body.gmail && request.body.message)) {
            return response.status(400).send("Missing subject or gmail or message")
        }

        this.service.create(new CreateMessageDTO(
            request.body.subject,
            request.body.gmail,
            request.body.message
        ))
    }

    showAllMessages (request: Request, response: Response) {
        response.send(this.service.all())
    }
}