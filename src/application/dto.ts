
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

export class CreateMessageDTO {
    subject: string
    gmail: string
    message: string

    constructor(subject: string, gmail: string, message: string) {
        this.subject = subject
        this.gmail = gmail
        this.message = message
    }
}

export class CreatePostDTO {
    title: string
    description: string
    image: string

    constructor(title: string, description: string, image: string) {
        this.title = title
        this.description = description
        this.image = image
    }
}

export class UpdatePostDTO {
    id: string
    title: string
    description: string
    image: string

    constructor(id: string, title: string, description: string, image: string) {
        this.id = id
        this.title = title
        this.description = description
        this.image = image
    }
}
