import { Request, Response } from 'express'
import { CreateUserDTO } from './../../../application/dto'
import { IUserService } from "../../../application/usecases/userService"
import { UserImpersonatesError, UserSubscriptionHasExpiredError, UserNotFoundError } from '../../../domain/errors'

export class UserHandler {
    private service: IUserService

    constructor(service: IUserService) {
        this.service = service
    }

    registerUser (request: Request, response: Response) {
        if (!(request.body.username && request.body.startPreiodDate && request.body.endPreiodDate)) {
            return response.status(400).send("Missing username or dates")
        }

        const dto = new CreateUserDTO(
            request.body.username as string,
            new Date(request.body.startPreiodDate),
            new Date(request.body.endPreiodDate)
        )

        response.send(this.service.register(dto))
    }

    updateUserInfo (request: Request, response: Response) {
        if (!request.body.key) {
            return response.status(400).send("Missing key")
        }

        try {
            response.send(this.service.update(request.body))

        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return response.status(404).send("User not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }

    deleteUser (request: Request, response: Response) {
        if (!request.body.key) {
            return response.status(400).send("Missing key")
        }

        try {
            response.send(this.service.delete(request.body.key))

        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return response.status(404).send("User not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }

    registerClientAction (request: Request, response: Response) {
        if (!(request.body.key && request.body.uuid)) {
            return response.status(400).send("Missing key or uuid")
        }

        try {
            const user = this.service.registerClientAction(request.body.key, request.body.key)
            response.send(user)

        } catch (error) {
            if (
                error instanceof UserImpersonatesError
                || error instanceof UserSubscriptionHasExpiredError
            ) {
                return response.status(400).send("Key not valid")

            } else if (error instanceof UserNotFoundError) {
                return response.status(404).send("User not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }
}
