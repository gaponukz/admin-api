import * as dotenv from "dotenv"

class Settings {
    telegramBotToken: string
    ownerID: string

    constructor(telegramBotToken: string, ownerID: string) {
        this.telegramBotToken = telegramBotToken
        this.ownerID = ownerID
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
        )
    }
}
