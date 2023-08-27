import { Post } from '../../domain/entities'
import { CreatePostDTO, UpdatePostDTO } from '../dto'
import { PostRepository } from '../../domain/repositories'
import {v4 as uuidv4} from 'uuid'

export interface IPostService {
    create(data: CreatePostDTO): Post
    update(data: UpdatePostDTO): void
    delete(id: string): void
    all(): Post[]
}

export class PostService implements IPostService {
    private repo: PostRepository

    constructor(repo: PostRepository) {
        this.repo = repo
    }

    create(data: CreatePostDTO): Post {
        const date = new Date((new Date()).toUTCString())
        const id = uuidv4()
        const post = new Post(id, data.title, data.description, data.image, date) 

        this.repo.create(post)
        return post
    }

    byID(id: string): Post {
        return this.repo.getByID(id)
    }  

    update(data: UpdatePostDTO): void {
        const post = this.repo.getByID(data.id)
        post.title = data.title
        post.description = data.description
        post.image = data.image

        this.repo.update(post)
    }

    delete(id: string): void {
        this.repo.delete(id)
    }

    all(): Post[] {
        return this.repo.all()
    }
}