import { Document } from 'mongoose'

interface UserDocument extends Document {
    username: string
    key: string
    startPeriodDate: Date
    endPeriodDate: Date
    isKeyActive: boolean
    isPro: boolean
    uuid: string | undefined
    impersonates: string | undefined
}

interface PostDocument extends Document {
    title: string
    description: string
    image: string
    date: Date
}

interface MessageDocument extends Document {
    subject: string
    gmail: string
    message: string
    date: Date
}

export { UserDocument, PostDocument, MessageDocument }
