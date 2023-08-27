import express, { Express, Request, Response } from 'express'

import { UserService } from "./src/application/usecases/userService"
import { PostService } from "./src/application/usecases/postService"
import { MessageService } from "./src/application/usecases/messageService"

import { JsonUserRepository } from "./src/infrastructure/db/jsonUserRepo"
import { JsonPostRepository } from "./src/infrastructure/db/jsonPostRepo"
import { JsonMessageRepository } from "./src/infrastructure/db/jsonMessageRepo"

import { UserHandler } from './src/infrastructure/controller/handlers/users'
import { PostHandler } from './src/infrastructure/controller/handlers/posts'
import { MessageHandler } from './src/infrastructure/controller/handlers/messages'

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

const usersHandler = new UserHandler(usersUsecase)
const postsHandler = new PostHandler(postsUsecase)
const messagesHandler = new MessageHandler(messagesUsecase)

const app: Express = express()

app.get('/get_all', usersHandler.showAll)
app.post('/get_user', usersHandler.registerClientAction)
app.post('/edit_user', usersHandler.updateUserInfo)
app.delete('/remove_user', usersHandler.deleteUser)

app.get('/get_posts', postsHandler.showAllPosts)
app.post('/add_post', postsHandler.publicNewPost)
app.delete('/remove_post', postsHandler.deletePost)

app.post('/send_message', messagesHandler.sendMessage)
app.get('/get_messages', messagesHandler.showAllMessages)

app.listen(settings.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${settings.port}`)
})
