export class User {
    username: string
    key: string
    startPeriodDate: Date
    endPeriodDate: Date
    isKeyActive: boolean
    isPro: boolean
    uuid: string | undefined
    impersonates: string | undefined

    constructor (username: string, key: string, startPeriod: Date, endPeriod: Date, isKeyActive: boolean, isPro: boolean, uuid: string | undefined, impersonates: string | undefined) {
        this.username = username
        this.key = key
        this.isPro = isPro
        this.startPeriodDate = startPeriod
        this.endPeriodDate = endPeriod
        this.isKeyActive = isKeyActive
        this.uuid = uuid
        this.impersonates = impersonates
    }
}

export class Post {
    id: number
    title: string
    description: string
    image: string

    constructor(id: number, title: string, description: string, image: string) {
        this.id = id
        this.title = title
        this.description = description
        this.image = image
    }
}

export class Message {
    subject: string
    gmail: string
    message: string
    date: Date

    constructor(subject: string, gmail: string, message: string, date: Date) {
        this.subject = subject
        this.gmail = gmail
        this.message = message
        this.date = date
    }
}
