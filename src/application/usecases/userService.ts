import { User } from '../../domain/entities'
import { CreateUserDTO, UpdateUserDTO } from './../dto'
import { UserRepository } from '../../domain/repositories'
import { UserSubscriptionHasExpiredError, UserImpersonatesError } from '../../domain/errors'
import { createHash } from 'crypto'

export interface IUserService {
    register(data: CreateUserDTO): Promise<User>
    update(data: UpdateUserDTO): Promise<void>
    delete(key: string): Promise<void>
    registerClientAction(key: string, uuid: string): Promise<User>
    all(): Promise<User[]>
}

export class UserService implements IUserService {
    private repo: UserRepository

    constructor(repo: UserRepository) {
        this.repo = repo
    }

    async register(data: CreateUserDTO): Promise<User> {
        if (data.startPreiodDate >= data.endPreiodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        if (new Date((new Date()).toUTCString()) > data.endPreiodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        const key = createHash('sha384')
            .update(data.username + new Date(), 'utf-8')
            .digest('hex')
        
        const user = new User(data.username, key, data.startPreiodDate, data.endPreiodDate, true, false, undefined, undefined)
        await this.repo.create(user)

        return user
    }

    async update(data: UpdateUserDTO): Promise<void> {
        const user = await this.repo.getByKey(data.key);
        const updatedUser = {
            ...user,
            ...(data.username && { username: data.username }),
            ...(data.startPeriodDate && { startPeriodDate: data.startPeriodDate }),
            ...(data.endPeriodDate && { endPeriodDate: data.endPeriodDate }),
            ...(data.isKeyActive !== undefined && { isKeyActive: data.isKeyActive }),
            ...(data.isPro !== undefined && { isPro: data.isPro }),
        };
    
        await this.repo.update(updatedUser);
    }

    async delete(key: string): Promise<void> {
        await this.repo.delete(await this.repo.getByKey(key))
    }

    async registerClientAction(key: string, uuid: string): Promise<User> {
        const user = await this.repo.getByKey(key)
        
        if (user.startPeriodDate >= user.endPeriodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        if (new Date((new Date()).toUTCString()) > user.endPeriodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        if (user.isKeyActive) {
            let howMuchLeft = user.endPeriodDate.getTime() - user.startPeriodDate.getTime()
            const sameUuidUser = await this.getSameUuidUser(user.username, uuid)
            howMuchLeft /= (60 * 60 * 1000)
    
            user.startPeriodDate = new Date((new Date()).toUTCString()) 
            user.endPeriodDate = new Date(new Date((new Date().getTime() + howMuchLeft * 3600000)).toUTCString())

            user.isKeyActive = true
            user.uuid = uuid
            user.impersonates = sameUuidUser
            
            await this.repo.update(user)

            if (sameUuidUser) {
                throw new UserImpersonatesError()
            }
        }
        
        return user
    }

    async all(): Promise<User[]> {
        return await this.repo.all()
    }

    private async getSameUuidUser(username: string, uuid: string): Promise<string | undefined> {
        const users = await this.repo.all()
        return users.find(u => u.username !== username && u.uuid === uuid)?.username
    }
}
