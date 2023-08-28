import { Post } from '../src/domain/entities'
import { PostNotFoundError } from '../src/domain/errors'
import { PostService } from '../src/application/usecases/postService'
import { PostRepository } from '../src/domain/repositories'
import { CreatePostDTO, UpdatePostDTO } from '../src/application/dto'

class PostRepositoryMock implements PostRepository {
    private posts: Post[]

    constructor () {
        this.posts = []
    }

    async create(post: Post): Promise<void> {
        this.posts.push(post)
    }

    async update(post: Post): Promise<void> {
        this.delete(post.id)
        this.create(post)
    }
    
    async delete(id: string): Promise<void> {
        this.posts.filter(post => post.id !== id)
    }
    
    async getByID(id: string): Promise<Post> {
        const post = this.posts.find(post => post.id === id)
        if (!post) {
            throw new PostNotFoundError()
        }

        return post
    }
    
    async all(): Promise<Post[]> {
        return this.posts
    }
}

describe('Test post creating', () => {
    const db = new PostRepositoryMock()
    const service = new PostService(db)

    test('Create correct post without errors', async () => {
        const expectedPost = new CreatePostDTO("new", "blabla", "http://img")
        const post = await service.create(expectedPost)

        expect(expectedPost.title).toBe(post.title)
        expect(expectedPost.description).toBe(post.description)
        expect(expectedPost.description).toBe(post.description)
    })

    test('Update post', async () => {
        let p = await service.create(new CreatePostDTO("test", "blabla", "http://img"))
        let expectedPost = new UpdatePostDTO(p.id, "upd", "some", p.image)
        service.update(expectedPost)
        const post = await service.byID(p.id)

        expect(expectedPost.title).toBe(post.title)
        expect(expectedPost.description).toBe(post.description)
        expect(expectedPost.image).toBe(post.image)
    })
})
