import fs from 'fs'
import { Post } from './../../domain/entities'
import { PostRepository } from '../../domain/repositories'
import { PostNotFoundError } from '../../domain/errors'

export class JsonPostRepository implements PostRepository{
    private filename: string

    constructor(filename: string) {
        this.filename = filename
    }

    async create(post: Post): Promise<void> {
        const posts = this.getAllPosts()
        posts.push(post)
        fs.writeFileSync(this.filename, JSON.stringify(posts))
    }

    async update(post: Post): Promise<void> {
        const posts = this.getAllPosts()
        const index = posts.findIndex(p => p.id === post.id)
        if (index !== -1) {
            posts[index] = post
            fs.writeFileSync(this.filename, JSON.stringify(posts))
        }
    }

    async delete(id: string): Promise<void> {
        const posts = this.getAllPosts()
        const updatedPosts = posts.filter(p => p.id !== id)
        fs.writeFileSync(this.filename, JSON.stringify(updatedPosts))
    }

    async getByID(id: string): Promise<Post> {
        const posts = this.getAllPosts();
        const post = posts.find(post => post.id === id)

        if (!post) {
            throw new PostNotFoundError()
        }

        return post
    }

    async all(): Promise<Post[]> {
        return this.getAllPosts();
    }

    private getAllPosts(): Post[] {
        try {
            const data = fs.readFileSync(this.filename, 'utf8')
            return JSON.parse(data);
        } catch (error) {
            return []
        }
    }
}
