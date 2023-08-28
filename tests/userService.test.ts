import { User } from '../src/domain/entities'
import { UserNotFoundError, UserSubscriptionHasExpiredError, UserImpersonatesError } from '../src/domain/errors'
import { UserRepository } from '../src/domain/repositories'
import { CreateUserDTO, UpdateUserDTO } from '../src/application/dto'
import { UserService } from '../src/application/usecases/userService'

class UserRepositoryMock implements UserRepository {
    private users: User[]

    constructor () {
        this.users = []
    }

    async create(user: User): Promise<void> {
        this.users.push(user)
    }

    async getByKey(key: string): Promise<User> {
        const user = this.users.find(u => u.key === key)
        if (!user) {
            throw new UserNotFoundError()
        }

        return user
    }

    async update(user: User): Promise<void> {
        this.users = this.users.filter(u => u.key !== user.key)
        this.users.push(user)
    }

    async delete(user: User): Promise<void> {
        this.users = this.users.filter(u => u.key !== user.key)
    }

    async all(): Promise<User[]> {
        return this.users
    }
}

describe('Test user registration', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)

    test('Create correct user without errors', async () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        endPeriodDate.setDate(endPeriodDate.getDate() + 1)

        const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
        const user = await service.register(newUser)

        expect(user.username).toBe(newUser.username)
        expect(user.startPeriodDate).toBe(newUser.startPreiodDate)
        expect(user.endPeriodDate).toBe(newUser.endPreiodDate)
        
        expect(user.isPro).toBe(false)
        expect(user.isKeyActive).toBe(true)
        expect(user.impersonates).toBe(undefined)

        const userFromDb = await db.getByKey(user.key)
        expect(user.username).toBe(userFromDb.username)
    })

    test('We should not start >= end', () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        startPeriodDate.setDate(startPeriodDate.getDate() + 1)

        expect(async() => {
            await service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        }).rejects.toThrow(UserSubscriptionHasExpiredError)
    })

    test('We should not register expired keys', () => {
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        startPeriodDate.setDate(startPeriodDate.getDate() - 1)
        endPeriodDate.setDate(endPeriodDate.getDate() - 2)

        expect(async () => {
            await service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        }).rejects.toThrow(UserSubscriptionHasExpiredError)
    })
})

describe('Test delete user', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)

    test('Delete user without errors', async () => {
        const user = await service.register(newUser)
        expect(async () => {
            await service.delete(user.key+"blabla")
        }).rejects.toThrow(UserNotFoundError)

        await service.delete(user.key)
        expect(async () => {
            await db.getByKey(user.key)
        }).rejects.toThrow(UserNotFoundError)
    })
})


describe('Test update user info', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    test('Correctly update user', async () => {
        const user = await service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))

        expect(async () => {
            await service.update(new UpdateUserDTO(user.key+"blabla"))
        }).rejects.toThrow(UserNotFoundError)

        await service.update({key: user.key, username: "new_username"})
        
        let newUser = await db.getByKey(user.key)
        expect(newUser.username).toBe("new_username")
        expect(newUser.endPeriodDate).toBe(user.endPeriodDate)
        expect(newUser.startPeriodDate).toBe(user.startPeriodDate)
        expect(newUser.isKeyActive).toBe(user.isKeyActive)
        expect(newUser.isPro).toBe(user.isPro)

        await service.update({key: user.key, isKeyActive: false})
        newUser = await db.getByKey(user.key)
        expect(newUser.isKeyActive).toBe(false)

        await service.update({key: user.key, isPro: true})
        newUser = await db.getByKey(user.key)
        expect(newUser.isPro).toBe(true)
    })
})

describe('Test register client action', () => {
    const db = new UserRepositoryMock()
    const service = new UserService(db)
    const startPeriodDate = new Date((new Date()).toUTCString())
    const endPeriodDate = new Date((new Date()).toUTCString())
    endPeriodDate.setDate(endPeriodDate.getDate() + 1)

    test('Detect expired key', async () => {
        const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
        const user = await service.register(newUser)
        user.startPeriodDate = new Date((new Date()).toUTCString())
        user.endPeriodDate = new Date((new Date()).toUTCString())
        user.startPeriodDate.setDate(user.startPeriodDate.getDate() - 2)
        user.endPeriodDate.setDate(user.endPeriodDate.getDate() - 1)
        await db.update(user)

        expect(async () => {
            await service.registerClientAction(user.key, "123")
        }).rejects.toThrow(UserSubscriptionHasExpiredError)
    })

    test('Detect same uuid', async () => {
        const newUser = new CreateUserDTO("test1", startPeriodDate, endPeriodDate)
        const user = await service.register(newUser)

        user.startPeriodDate.setDate(user.startPeriodDate.getDate() + 1)
        user.endPeriodDate.setDate(user.endPeriodDate.getDate() + 2)
        await db.update(user)
        await db.create(new User("sus", "qwe", new Date(), new Date(), true, false, "123", undefined))

        expect(async () => {
            await service.registerClientAction(user.key, "123")
        }).rejects.toThrow(UserImpersonatesError)
    })

    test('When key was not active', async () => {
        const db = new UserRepositoryMock()
        const service = new UserService(db)
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        endPeriodDate.setDate(endPeriodDate.getDate() + 1)

        const expectedUser = await service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        const user = await service.registerClientAction(expectedUser.key, "123")

        expect(user.isKeyActive).toBe(true)
        expect(user.uuid).toBe("123")
        expect(user.impersonates).toBe(undefined)

        expect(user.startPeriodDate < new Date((new Date()).toUTCString())).toBeFalsy()
        expect(user.startPeriodDate.getTime() - user.endPeriodDate.getTime()).toBe(expectedUser.startPeriodDate.getTime() - user.endPeriodDate.getTime())
    })

    test('When key was already active', async () => {
        const db = new UserRepositoryMock()
        const service = new UserService(db)
        const startPeriodDate = new Date((new Date()).toUTCString())
        const endPeriodDate = new Date((new Date()).toUTCString())
        endPeriodDate.setDate(endPeriodDate.getDate() + 1)

        const expectedUser = await service.register(new CreateUserDTO("test1", startPeriodDate, endPeriodDate))
        expectedUser.isKeyActive = true
        await db.update(expectedUser)

        const user = await service.registerClientAction(expectedUser.key, "123")
        expect(user.isKeyActive).toBe(true)
        expect(user.uuid).toBe("123")

        expect(user.startPeriodDate.getTime()).toBe(expectedUser.startPeriodDate.getTime())
        expect(user.endPeriodDate.getTime()).toBe(expectedUser.endPeriodDate.getTime())
    })
})
