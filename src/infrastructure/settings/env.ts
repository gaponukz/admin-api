import * as dotenv from "dotenv"

class Settings {
    telegramBotToken: string
    ownerID: string
    port: number
    dbUri: string

    constructor(telegramBotToken: string, ownerID: string, port: number, dbUri: string) {
        this.telegramBotToken = telegramBotToken
        this.ownerID = ownerID
        this.port = port
        this.dbUri = dbUri
    }
}

export class EnvSettingsExporter {
    constructor(loadDotEnv = false) {
        if (loadDotEnv) {
            dotenv.config()
        }
    }
    load(): Settings {
        return new Settings(
            process.env.telegramBotToken as string,
            process.env.ownerID as string,
            parseInt(process.env.PORT || "8080"),
            process.env.dbUri as string
        )
    }
}
