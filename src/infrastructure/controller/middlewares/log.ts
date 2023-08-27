import { Request, Response, NextFunction  } from 'express'

export function consoleLogMiddleware (request: Request, response: Response, next: NextFunction)  {
    console.log(`${request.method} ${response.statusCode} ${request.path}`)
    next()
}
