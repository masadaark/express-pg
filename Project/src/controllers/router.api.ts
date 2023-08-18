import { Application, Request, Response } from "express"


export const setUpRouter = (app: Application): void => {
    app.get("/healthcheck", (_req: Request, res: Response) => {
        res.json({ "status": "I'm fine, Thank you :)" })
    })
}