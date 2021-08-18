const express = require('express')
const app = express();
const logger = require('./loggerMiddleware')

// Esto sirve para que cualquier origen de datos funcione en nuestra app
// Si tenemos nuestra aplicación en localhost:3000 y queremos levantar
// este API para recuperar los datos, esta se encuentra en un origen distinto.
// Se encuentra en localhost:3001
app.use(cors())

// Soportar la request que tiene un objeto y pueda parsearlo, hay que decirle que lo use
// express, la nueva versión de express ya trae esto si no tendriamos que instalar
// body-parser de express
app.use(express.json())

// Esto de app.use es un middleware
app.use(logger)

//const http = require('http')

let notes = [
  {
    "id": 1,
    "content": "Nota 1",
    "date": "2020-06-30T19:20:14.298Z",
    "important": true
  },
  {
    "id": 2,
    "content": "Nota 2",
    "date": "2020-06-30T19:20:14.298Z",
    "important": false
  },
  {
    "id": 3,
    "content": "Nota 3",
    "date": "2020-06-30T19:20:14.298Z",
    "important": true
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json'})
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end();
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(n => n.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString
  }

  notes = [...notes, newNote]

  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})