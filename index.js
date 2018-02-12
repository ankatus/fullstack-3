
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(bodyParser.json())
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

const checkNameAndNumber = (person) => {
  if (person.name === '' || person.name === null) {
    return 'name must not be empty'
  }
  if (person.number === '' || person.number === null) {
    return 'number must not be empty'
  }
  return null
}

app.put('/api/persons/:id', (req, res) => {
  const updated = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, updated, { new: true }).then(updatedPerson => {
    console.log(updatedPerson)
    res.json(Person.format(updatedPerson))
  }).catch(error => {
    res.status(400).send({ error: 'malformatted id' })
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  const personError = checkNameAndNumber(person)
  if (personError !== null) {
    res.status(400).send({error: personError})
  } else {
    Person
      .find({})
      .then(elements => {
        if (elements.find(element => element.name === person.name) !== undefined) {
          res.status(400).send({ error: 'name already in database' })
        } else {
          person
            .save()
            .then(savedPerson => {
              res.json(Person.format(savedPerson))
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    }).catch(error => {
      res.status(404).end()
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(Person.format))
  })
})

app.get('/info', (req, res) => {
  Person.count({}, function (err, count) {
    if (!err) {
      res.send('puhelinluettelossa ' + count + ' henkilön tiedot\n' + new Date())
    } else {
      res.status(400).end()
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
