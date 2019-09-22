
const express = require('express')
require('./db/mongoose')
const app = express()


const UserRouter = require('./Router/user')
const TaskRouter =  require('./Router/task')
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

module.exports = app

