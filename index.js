const express = require('express')
const app = express()

// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/', express.static('browser'))

app.listen(process.env.PORT, () => console.log('Example app listening on port 80!'))
