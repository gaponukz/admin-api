import * as dotenv from "dotenv"

class Settings {
    telegramBotToken: string
    ownerID: string
    port: number

    constructor(telegramBotToken: string, ownerID: string, port: number) {
        this.telegramBotToken = telegramBotToken
        this.ownerID = ownerID
        this.port = port
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
            parseInt(process.env.PORT || "8080")
        )
    }
}
