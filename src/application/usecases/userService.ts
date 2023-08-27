import { User } from '../../domain/entities'
import { CreateUserDTO, UpdateUserDTO } from './../dto'
import { UserRepository } from '../../domain/repositories'
import { UserSubscriptionHasExpiredError, UserImpersonatesError } from '../../domain/errors'
import { createHash } from 'crypto'

export interface IUserService {
    register(data: CreateUserDTO): User
    update(data: UpdateUserDTO): void
    delete(key: string): void
    registerClientAction(key: string, uuid: string): User
    all(): User[]
}

export class UserService implements IUserService {
    private repo: UserRepository

    constructor(repo: UserRepository) {
        this.repo = repo
    }

    register(data: CreateUserDTO): User {
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
        this.repo.create(user)

        return user
    }

    update(data: UpdateUserDTO): void {
        const user = this.repo.getByKey(data.key);
        const updatedUser = {
            ...user,
            ...(data.username && { username: data.username }),
            ...(data.startPeriodDate && { startPeriodDate: data.startPeriodDate }),
            ...(data.endPeriodDate && { endPeriodDate: data.endPeriodDate }),
            ...(data.isKeyActive !== undefined && { isKeyActive: data.isKeyActive }),
            ...(data.isPro !== undefined && { isPro: data.isPro }),
        };
    
        this.repo.update(updatedUser);
    }

    delete(key: string): void {
        this.repo.delete(this.repo.getByKey(key))
    }

    registerClientAction(key: string, uuid: string): User {
        const user = this.repo.getByKey(key)
        
        if (user.startPeriodDate >= user.endPeriodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        if (new Date((new Date()).toUTCString()) > user.endPeriodDate) {
            throw new UserSubscriptionHasExpiredError()
        }

        if (user.isKeyActive) {
            let howMuchLeft = user.endPeriodDate.getTime() - user.startPeriodDate.getTime()
            const sameUuidUser = this.getSameUuidUser(user.username, uuid)
            howMuchLeft /= (60 * 60 * 1000)
    
            user.startPeriodDate = new Date((new Date()).toUTCString()) 
            user.endPeriodDate = new Date(new Date((new Date().getTime() + howMuchLeft * 3600000)).toUTCString())

            user.isKeyActive = true
            user.uuid = uuid
            user.impersonates = sameUuidUser
            
            this.repo.update(user)

            if (sameUuidUser) {
                throw new UserImpersonatesError()
            }
        }
        
        return user
    }

    all(): User[] {
        return this.repo.all()
    }

    private getSameUuidUser(username: string, uuid: string): string | undefined {
        const users = this.repo.all()
        return users.find(u => u.username !== username && u.uuid === uuid)?.username
    }
}
