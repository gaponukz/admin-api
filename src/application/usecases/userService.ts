import { UserRepository } from '../../domain/repositories'
import { User } from '../../domain/entities'
import { UserSubscriptionHasExpiredError } from '../../domain/errors'
import { CreateUserDTO, UpdateUserDTO } from './../dto'
import { createHash } from 'crypto'

export class UserService {
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
        
        const user = new User(data.username, key, data.startPreiodDate, data.endPreiodDate, true, false, undefined)
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
}
