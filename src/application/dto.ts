
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
