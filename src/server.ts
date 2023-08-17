import express, { Request, Response } from "express"
import { Query } from "express-serve-static-core"

const app = express()

app.get("/", (_req, res) => {
    res.json({ result: "Http status is ok" })
})

export type Test = { message: string }

export interface TypeRequestQuery<T extends Query> {
    query: T
}

app.get("/test", (req: TypeRequestQuery<Test>, res: Response) => {
    res.json(req.query)
})


app.listen(3000, () => console.log("Server is running..."))
