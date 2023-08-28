import mongoose, { Model } from 'mongoose'
import { User } from './../../domain/entities'
import { UserRepository } from '../../domain/repositories'
import { UserNotFoundError } from '../../domain/errors'
import { UserDocument } from './mongodb/documents'
import { UserSchema } from './mongodb/schemas'

export class MongoUserRepository implements UserRepository{
    private mongoUser: Model<UserDocument>

    constructor() {
        this.mongoUser = mongoose.model<UserDocument>('User', UserSchema)
    }

    async create(user: User): Promise<void> {
        const newUser = new this.mongoUser(user)
        await newUser.save()
    }

    async getByKey(key: string): Promise<User> {
        const user = await this.mongoUser.findOne({key: key})
        
        if (!user) {
            throw new UserNotFoundError()
        }

        return new User(
            user.username,
            user.key, user.startPeriodDate,
            user.endPeriodDate,
            user.isKeyActive,
            user.isPro,
            user.uuid,
            user.impersonates
        )
    }

    async update(user: User): Promise<void> {
        await this.mongoUser.updateOne({ key: user.key }, user)
    }

    async delete(user: User): Promise<void> {
        await this.mongoUser.deleteOne({ key: user.key })
    }

    async all(): Promise<User[]> {
        const users = await this.mongoUser.find()

        return users.map(user => new User(
            user.username,
            user.key,
            user.startPeriodDate,
            user.endPeriodDate,
            user.isKeyActive,
            user.isPro,
            user.uuid,
            user.impersonates
        ))
    }
}