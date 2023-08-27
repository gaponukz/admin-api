import { Request, Response, NextFunction  } from 'express'

export function disableCorsMiddleware (request: Request, response: Response, next: NextFunction)  {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-Type', 'application/json')
    next()
}