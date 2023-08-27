import fs from 'fs'
import { User } from './../../domain/entities'
import { UserRepository } from '../../domain/repositories'
import { UserNotFoundError } from '../../domain/errors'

export class JsonUserRepository implements UserRepository {
    private filename: string

    constructor(filename: string) {
        this.filename = filename
    }

    create(user: User): void {
        const users = this.getAllUsers()
        users.push(user)
        fs.writeFileSync(this.filename, JSON.stringify(users))
    }

    getByKey(key: string): User {
        const users = this.getAllUsers()
        const user =  users.find(user => user.key === key)

        if (!user) {
            throw new UserNotFoundError()
        }

        return user
    }

    update(user: User): void {
        const users = this.getAllUsers()
        const index = users.findIndex(u => u.key === user.key)
        if (index !== -1) {
            users[index] = user
            fs.writeFileSync(this.filename, JSON.stringify(users))
        }
    }

    delete(user: User): void {
        const users = this.getAllUsers()
        const updatedUsers = users.filter(u => u.key !== user.key)
        fs.writeFileSync(this.filename, JSON.stringify(updatedUsers))
    }

    all(): User[] {
        return this.getAllUsers()
    }

    private getAllUsers(): User[] {
        try {
            const data = fs.readFileSync(this.filename, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }
}
