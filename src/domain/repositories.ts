import { User, Post, Message } from './entities'

interface UserRepository {
    create(user: User): Promise<void>
    getByKey(key: string): Promise<User>
    update(user: User): Promise<void>
    delete(user: User): Promise<void>
    all(): Promise<User[]>
}

interface PostRepository {
    create(post: Post): Promise<void>
    update(post: Post): Promise<void>
    delete(id: string): Promise<void>
    getByID(id: string): Promise<Post>
    all(): Promise<Post[]>
}

interface MessageRepository {
    create(message: Message): Promise<void>
    all(): Promise<Message[]>
}

export { UserRepository, MessageRepository, PostRepository }
