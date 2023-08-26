
export class CreateUserDTO {
    username: string
    startPreiodDate: Date
    endPreiodDate: Date

    constructor (username: string, startPreiodDate: Date, endPreiodDate: Date) {
        this.username = username
        this.startPreiodDate = startPreiodDate
        this.endPreiodDate = endPreiodDate
    }
}

export class UpdateUserDTO {
    key: string
    username?: string
    startPeriodDate?: Date
    endPeriodDate?: Date
    isKeyActive?: boolean
    isPro?: boolean

    constructor(key: string, username?: string, startPeriodDate?: Date, endPeriodDate?: Date, isKeyActive?: boolean, isPro?: boolean) {
        this.key = key
        this.username = username
        this.startPeriodDate = startPeriodDate
        this.endPeriodDate = endPeriodDate
        this.isKeyActive = isKeyActive
        this.isPro = isPro
    }
}
