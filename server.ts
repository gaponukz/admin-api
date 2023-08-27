import { UserService } from "./src/application/usecases/userService"
import { PostService } from "./src/application/usecases/postService"
import { MessageService } from "./src/application/usecases/messageService"

import { JsonUserRepository } from "./src/infrastructure/db/jsonUserRepo"
import { JsonPostRepository } from "./src/infrastructure/db/jsonPostRepo"
import { JsonMessageRepository } from "./src/infrastructure/db/jsonMessageRepo"

import { TelegramNotifier } from "./src/infrastructure/notifier/telegram"
import { EnvSettingsExporter } from "./src/infrastructure/settings/env"

const settings = new EnvSettingsExporter().load()

const usersDB = new JsonUserRepository("users.json")
const postsDB = new JsonPostRepository("posts.json")
const messagesDB = new JsonMessageRepository("messages.json")

const notifier = new TelegramNotifier(settings.telegramBotToken, settings.ownerID)

const usersUsecase = new UserService(usersDB)
const postsUsecase = new PostService(postsDB)
const messagesUsecase = new MessageService(messagesDB, notifier)
