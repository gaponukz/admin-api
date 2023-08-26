import { UserRepository } from '../../domain/repositories'
import { User } from '../../domain/entities'
import { UserSubscriptionHasExpiredError } from '../../domain/errors'
import { CreateUserDTO } from './../dto'
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

    delete(key: string): void {
        this.repo.delete(this.repo.getByKey(key))
    }
}
