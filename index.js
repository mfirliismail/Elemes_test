const express = require('express')
const app = express()
const routes = require('./routes')
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/v1', routes)

app.get('/', (req, res) => res.status(200).json({ status: "success", message: "server running successfully" }))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})