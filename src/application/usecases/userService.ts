import { User } from '../../domain/entities'
import { CreateUserDTO, UpdateUserDTO } from './../dto'
import { UserRepository } from '../../domain/repositories'
import { UserSubscriptionHasExpiredError } from '../../domain/errors'
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

    registerClientAction(key: string, uuid: string): User {
        // export async function registerClientAction(request: Request): Promise<UserEntity | undefined> {
        //     const result = await getUserFromRequest(request)
        //     if (!result) return
        
        //     const { user, uuid } = result
        
        //     if (user.isKeyActive) {
        //         let howMuchLeft = user.endPeriodDate.getTime() - user.startPeriodDate.getTime()
        //         howMuchLeft /= (60 * 60 * 1000)
        
        //         user.startPeriodDate = getUTCDate()
        //         user.endPeriodDate = afterHours(howMuchLeft)
        
        //         let sameUuidUsers = await getSameUuidUsers(request.query.uuid as string)
        //         sameUuidUsers =  sameUuidUsers.filter(_user => _user.key != user.key)
        
        //         await userDB.update(user, {
        //             startPeriodDate: user.startPeriodDate,
        //             endPeriodDate: user.endPeriodDate,
        //             isKeyActive: true,
        //             uuid: uuid,
        //             impersonates: sameUuidUsers[0]
        //         })
        
        //     }
        
        //     return user
        // }
        return this.repo.getByKey(key);
    }
}
