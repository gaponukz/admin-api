import { User } from '../src/domain/entities'
import { UserNotFoundError, UserSubscriptionHasExpiredError } from '../src/domain/errors'
import { UserRepository } from '../src/domain/repositories'
import { CreateUserDTO, UpdateUserDTO } from '../src/application/dto'
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
        this.users = this.users.filter(u => u.key !== user.key)
        this.users.push(user)
    }

    delete(user: User): void {
        this.users = this.users.filter(u => u.key !== user.key)
    }

    all(): User[] {
        return this.users
    }
}

describe('Test user registration', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)

    test('Create correct user without errors', () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        endPeriodDate.setDate(endPeriodDate.getDate() + 1)

        const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
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

    test('We should not start >= end', () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        startPeriodDate.setDate(startPeriodDate.getDate() + 1)

        expect(() => {
            service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        }).toThrow(UserSubscriptionHasExpiredError)
    })

    test('We should not register expired keys', () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        startPeriodDate.setDate(startPeriodDate.getDate() - 1)
        endPeriodDate.setDate(endPeriodDate.getDate() - 2)

        expect(() => {
            service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        }).toThrow(UserSubscriptionHasExpiredError)
    })
})

describe('Test delete user', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
    const user = service.register(newUser)

    test('Can not delete non existent user', () => {
        expect(() => {
            service.delete(user.key+"blabla")
        }).toThrow(UserNotFoundError)
    })

    test('Delete user without errors', () => {
        service.delete(user.key)
        expect(() => {
            db.getByKey(user.key)
        }).toThrow(UserNotFoundError)
    })
})


describe('Test update user info', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
    const user = service.register(newUser)

    test('Can not update non existent user', () => {
        expect(() => {
            service.update(new UpdateUserDTO(user.key+"blabla"))
        }).toThrow(UserNotFoundError)
    })

    test('Correctly update user', () => {
        service.update({key: user.key, username: "new_username"})
        
        let newUser = db.getByKey(user.key)
        expect(newUser.username).toBe("new_username")
        expect(newUser.endPeriodDate).toBe(user.endPeriodDate)
        expect(newUser.startPeriodDate).toBe(user.startPeriodDate)
        expect(newUser.isKeyActive).toBe(user.isKeyActive)
        expect(newUser.isPro).toBe(user.isPro)

        service.update({key: user.key, isKeyActive: false})
        newUser = db.getByKey(user.key)
        expect(newUser.isKeyActive).toBe(false)

        service.update({key: user.key, isPro: true})
        newUser = db.getByKey(user.key)
        expect(newUser.isPro).toBe(true)
    })
})

describe('Test register client action', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
    const user = service.register(newUser)
    db.update(user)

    test('Detect expired key', () => {})

    test('Detect same uuid', () => {})
})
