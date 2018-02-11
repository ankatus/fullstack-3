
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
app.use(bodyParser.json())
morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    },
]



const checkPersonForErrors = (person) => {
    if (persons.find(element => element.name === person.name) !== undefined) {
        return "name must be unique"
    }
    if (person.name === "" || person.name === null) {
        return "name must not be empty"
    }
    if (person.number === "" || person.number === null) {
        return "number must not be empty"
    }
    return null
}

app.put('/api/persons/:id', (req, res) => {
    const index = persons.findIndex(person => person.id === Number(req.params.id))
    persons[index] = {
        name: req.body.name,
        number: req.body.number,
        id: Number(req.params.id)
    }
    console.log(persons[index])
    res.json(persons[index])
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    const personError = checkPersonForErrors(person)
    if (personError !== null) {
        res.status(400).json({ error: personError })
        return
    }
    person.id = Math.round(Math.random() * (100000 - 1) + 1)
    persons.push(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person !== undefined) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send("puhelinluettelossa " + persons.length + " henkilön tiedot\n" + new Date())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})