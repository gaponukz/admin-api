import { Client } from 'ts-postgres'
import { User } from './../../domain/entities'
import { UserRepository } from '../../domain/repositories'
import { UserNotFoundError } from '../../domain/errors'

export class PostgresUserRepository implements UserRepository {
    private client: Client

    constructor() {
        this.client = new Client()
        this.client.connect()
    }

    async create(user: User): Promise<void> {
        const query = `
            INSERT INTO users (username, key, start_period, end_period, is_key_active, is_pro, uuid, impersonates)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const values = [
            user.username,
            user.key,
            user.startPeriodDate,
            user.endPeriodDate,
            user.isKeyActive,
            user.isPro,
            user.uuid,
            user.impersonates,
        ];

        await this.client.query(query, values)
    }

    async getByKey(key: string): Promise<User | null> {
        const query = `
            SELECT * FROM users WHERE key = $1
        `;
        const result = await this.client.query(query, [key])

        if (result.rowCount === 0) {
            throw new UserNotFoundError('User not found')
        }

        const userData = result.rows[0];
        const user = this.mapRowToUser(userData)

        return user
    }

    async update(user: User): Promise<void> {
        const query = `
            UPDATE users
            SET username = $2, start_period = $3, end_period = $4,
                is_key_active = $5, is_pro = $6, uuid = $7, impersonates = $8
            WHERE key = $1
        `;
        const values = [
            user.key,
            user.username,
            user.startPeriodDate,
            user.endPeriodDate,
            user.isKeyActive,
            user.isPro,
            user.uuid,
            user.impersonates,
        ]

        await this.client.query(query, values)
    }

    async delete(user: User): Promise<void> {
        const query = `
            DELETE FROM users WHERE key = $1
        `

        await this.client.query(query, [user.key])
    }

    async all(): Promise<User[]> {
        const query = `
            SELECT * FROM users
        `

        const result = await this.client.query(query)
        const users = result.rows.map((userData) => this.mapRowToUser(userData))

        return users
    }

    private mapRowToUser(userData: any): User {
        return new User(
            userData.username,
            userData.key,
            userData.start_period,
            userData.end_period,
            userData.is_key_active,
            userData.is_pro,
            userData.uuid,
            userData.impersonates
        )
    }
}
