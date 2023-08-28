import mongoose, { Model } from 'mongoose'
import { Post } from './../../domain/entities'
import { PostRepository } from '../../domain/repositories'
import { PostNotFoundError } from '../../domain/errors'
import { PostDocument } from './mongodb/documents'
import { PostSchema } from './mongodb/schemas'

export class MongoPostRepository {
    private mongoPost: Model<PostDocument>

    constructor() {
        this.mongoPost = mongoose.model<PostDocument>('Post', PostSchema)
    }

    async create(post: Post): Promise<void> {
        const newPost = new this.mongoPost(post)
        await newPost.save()
    }

    async update(post: Post): Promise<void> {
        await this.mongoPost.updateOne({ _id: post.id }, post)
    }

    async delete(id: string): Promise<void> {
        await this.mongoPost.deleteOne({ _id: id })
    }

    async getByID(id: string): Promise<Post> {
        const post = await this.mongoPost.findOne({ _id: id })

        if (!post) {
            throw new PostNotFoundError()
        }

        return new Post(post._id, post.title, post.description, post.image, post.date)
    }

    async all(): Promise<Post[]> {
        const posts = await this.mongoPost.find()

        return posts.map(post => new Post(
            post.id,
            post.title,
            post.description,
            post.image,
            post.date
        ))
    }
}
