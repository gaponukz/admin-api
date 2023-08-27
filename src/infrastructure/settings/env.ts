class Settings {
    telegramBotToken: string
    ownerID: string

    constructor(telegramBotToken: string, ownerID: string) {
        this.telegramBotToken = telegramBotToken
        this.ownerID = ownerID
    }
}

class EnvSettingsExporter {
    load(): Settings {
        return new Settings(
            process.env.telegramBotToken as string,
            process.env.ownerID as string,
        )
    }
}
