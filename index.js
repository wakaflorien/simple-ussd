import express from "express";
import dotenv from "dotenv"
import mongoose, {Model} from "mongoose";
import bodyParser from "body-parser"
import UssdMenu from "ussd-builder";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.DATABASE_URI)
const database = mongoose.connection
database.on("error", (error) => {
  console.log(error)
})
database.once("connected", ()=> {
  console.log("Database connected...")
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}))

let menu = new UssdMenu()
menu.startState({
  run: () => {
    menu.con('Welcome! Ready to register for the Zizi Conference:' +
    '\n1. Get started' +
    '\n2. Get out!')
  }, next: {
    '1': 'register',
    '2': 'quit'
  }
})
menu.state('register', {
  run: () => {
    menu.con('Before we go ahead, whats your name ')
  }, next: {
    '*[a-zA-Z]+': 'register.tickets'
  }
})
menu.state('register.tickets', {
  run: () => {
    let name = menu.val;
    dataToSave.name = name;
    console.log(dataToSave)
    menu.con('How many tickets would you like to reserve?');
  }, next: {
    '*\\d+': 'end'
  }
})
menu.state('end', {
  run: async () => {
    let tickets = menu.val;
    dataToSave.tickets = tickets
    console.log(dataToSave)

    // Save the data
    const data = new Model({
      name: dataToSave.name,
      tickets: dataToSave.tickets
    })
    const dataSaved = await data.save()

    menu.end('Awesome! We have your tickets reserved. Sending a confirmation text shortly.')
  }
})
menu.state('quit', {
  run: () => {
    menu.end('Goodbye :')
  }
})

app.post('/ussd', (req, res) => {
  menu.run(req.body, ussdResult => {
    res.send(ussdResult)
  })
})
app.listen(PORT, () => {
  console.log(`app running on localhost:${PORT}`)
})
