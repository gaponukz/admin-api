import { Post } from '../../domain/entities'
import { CreatePostDTO, UpdatePostDTO } from '../dto'
import { PostRepository } from '../../domain/repositories'
import {v4 as uuidv4} from 'uuid'

export interface IPostService {
    create(data: CreatePostDTO): Promise<Post>
    update(data: UpdatePostDTO): Promise<void>
    delete(id: string): Promise<void>
    all(): Promise<Post[]>
}

export class PostService implements IPostService {
    private repo: PostRepository

    constructor(repo: PostRepository) {
        this.repo = repo
    }

    async create(data: CreatePostDTO): Promise<Post> {
        const date = new Date((new Date()).toUTCString())
        const id = uuidv4()
        const post = new Post(id, data.title, data.description, data.image, date) 

        await this.repo.create(post)
        return post
    }

    async byID(id: string): Promise<Post> {
        return await this.repo.getByID(id)
    }  

    async update(data: UpdatePostDTO): Promise<void> {
        const post = await this.repo.getByID(data.id)
        post.title = data.title
        post.description = data.description
        post.image = data.image

        await this.repo.update(post)
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id)
    }

    async all(): Promise<Post[]> {
        return await this.repo.all()
    }
}