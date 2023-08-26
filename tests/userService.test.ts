import { User } from '../src/domain/entities'
import { UserNotFoundError } from '../src/domain/errors'
import { UserRepository } from '../src/domain/repositories'
import { CreateUserDTO } from '../src/application/dto'
import { UserService } from '../src/application/usecases/userService'

class UserRepositoryMock implements UserRepository {
    private users: User[]

    constructor () {
        this.users = []
    }

    create(user: User): void {
        this.users.push(user)
    }

    getByKey(key: string): User {
        const user = this.users.find(u => u.key === key)
        if (!user) {
            throw new UserNotFoundError()
        }

        return user
    }

    update(user: User): void {
        this.users = this.users.filter(u => u.key === user.key)
        this.users.push(user)
    }

    delete(user: User): void {
        this.users = this.users.filter(u => u.key === user.key)
    }

    all(): User[] {
        return this.users
    }
}

describe('Test user service', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)

    test('Create correct user without errors', () => {
        const newUser = new CreateUserDTO("test1", new Date(), new Date())
        const user = service.register(newUser)

        expect(user.username).toBe(newUser.username)
        expect(user.startPeriodDate).toBe(newUser.startPreiodDate)
        expect(user.endPeriodDate).toBe(newUser.endPreiodDate)
        
        expect(user.isPro).toBe(false)
        expect(user.isKeyActive).toBe(true)
        expect(user.impersonates).toBe(undefined)

        const userFromDb = db.getByKey(user.key)
        expect(user.username).toBe(userFromDb.username)
    })
})
