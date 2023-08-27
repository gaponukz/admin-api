import { Request, Response } from 'express'
import { CreatePostDTO, UpdatePostDTO } from './../../../application/dto'
import { IPostService } from "../../../application/usecases/postService"
import { PostNotFoundError } from '../../../domain/errors'

export class PostHandler {
    private service: IPostService

    constructor(service: IPostService) {
        this.service = service
    }

    publicNewPost (request: Request, response: Response) {
        if (!(request.body.title && request.body.description && request.body.image)) {
            return response.status(400).send("Missing title or image or description")
        }

        response.send(
            this.service.create(new CreatePostDTO(
                request.body.title,
                request.body.description,
                request.body.image
            ))
        )
    }

    updatePostContent (request: Request, response: Response) {
        if (!(request.body.id && request.body.title && request.body.description && request.body.image)) {
            return response.status(400).send("Missing some fields")
        }

        try {
            this.service.update(new UpdatePostDTO(
                request.body.id,
                request.body.title,
                request.body.description,
                request.body.image
            ))
            response.status(200)

        } catch (error) {
            if (error instanceof PostNotFoundError) {
                return response.status(404).send("Post not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }

    showAllPosts (request: Request, response: Response) {
        response.send(this.service.all())
    }

    showPost (request: Request, response: Response) {
        if (!request.body.id) {
            return response.status(400).send("Missing post id")
        }

        try {
            response.send(this.service.byID(request.body.id))

        } catch (error) {
            if (error instanceof PostNotFoundError) {
                return response.status(404).send("Post not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }

    deletePost (request: Request, response: Response) {
        if (!request.body.id) {
            return response.status(400).send("Missing post id")
        }

        try {
            response.send(this.service.delete(request.body.id))

        } catch (error) {
            if (error instanceof PostNotFoundError) {
                return response.status(404).send("Post not found")
            
            } else {
                return response.status(500).send("server error")
            }
        }
    }
}