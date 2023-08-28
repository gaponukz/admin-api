import mongoose from 'mongoose'
import express, { Express } from 'express'

import { UserService } from "./src/application/usecases/userService"
import { PostService } from "./src/application/usecases/postService"
import { MessageService } from "./src/application/usecases/messageService"

import { MongoUserRepository } from "./src/infrastructure/db/mongoUserRepo"
import { MongoPostRepository } from "./src/infrastructure/db/mongoPostRepo"
import { MongoMessageRepository } from "./src/infrastructure/db/mongoMessageRepo"

import { UserHandler } from './src/infrastructure/controller/handlers/users'
import { PostHandler } from './src/infrastructure/controller/handlers/posts'
import { MessageHandler } from './src/infrastructure/controller/handlers/messages'
import { consoleLogMiddleware } from './src/infrastructure/controller/middlewares/log'
import { disableCorsMiddleware } from './src/infrastructure/controller/middlewares/auth'

import { TelegramNotifier } from "./src/infrastructure/notifier/telegram"
import { EnvSettingsExporter } from "./src/infrastructure/settings/env"

const settings = new EnvSettingsExporter(true).load()

const usersDB = new MongoUserRepository()
const postsDB = new MongoPostRepository()
const messagesDB = new MongoMessageRepository()

const notifier = new TelegramNotifier(settings.telegramBotToken, settings.ownerID)

const usersUsecase = new UserService(usersDB)
const postsUsecase = new PostService(postsDB)
const messagesUsecase = new MessageService(messagesDB, notifier)

const usersHandler = new UserHandler(usersUsecase)
const postsHandler = new PostHandler(postsUsecase)
const messagesHandler = new MessageHandler(messagesUsecase)

const app: Express = express()

mongoose.connect(settings.dbUri, { useNewUrlParser: true } as any)

app.use(consoleLogMiddleware)
app.use(disableCorsMiddleware)

app.get('/get_all', usersHandler.showAll.bind(usersHandler))
app.post('/get_user', usersHandler.registerClientAction.bind(usersHandler))
app.post('/edit_user', usersHandler.updateUserInfo.bind(usersHandler))
app.delete('/remove_user', usersHandler.deleteUser.bind(usersHandler))

app.get('/get_posts', postsHandler.showAllPosts.bind(postsHandler))
app.post('/add_post', postsHandler.publicNewPost.bind(postsHandler))
app.delete('/remove_post', postsHandler.deletePost.bind(postsHandler))

app.post('/send_message', messagesHandler.sendMessage.bind(messagesHandler))
app.get('/get_messages', messagesHandler.showAllMessages.bind(messagesHandler))

app.listen(settings.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${settings.port}`)
})
