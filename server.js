import express from "express";
import bodyParser from "body-parser"
import ussdRoute from "./index"

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.listen(PORT, () => {
  console.log(`app running on localhost:${PORT}`)
})
