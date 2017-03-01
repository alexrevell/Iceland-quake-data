import express from 'express'

let app = express()

app.use('/', express.static(__dirname))
app.listen(1337, '127.0.0.1')

console.log('Server running at http://127.0.0.1:1337/')
