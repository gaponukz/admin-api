import { User, Post, Message } from './entities'

interface UserRepository {
    create(user: User): void
    getByKey(key: string): User
    update(user: User): void
    delete(user: User): void
    all(): User[]
}

interface PostRepository {
    create(post: Post): void
    update(post: Post): void
    delete(post: Post): void
    all(): Post[]
}

interface MessageRepository {
    create(message: Message): void
    delete(message: Message): void
    all(): Message[]
}

export { UserRepository, MessageRepository, PostRepository }
