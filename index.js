require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Person = require('./models/person')
const morgan = require('morgan')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const today = new Date()
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    ${today}`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person)
      res.json(person)
    else
      res.status(404).end()
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, error) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true }).then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
  
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})