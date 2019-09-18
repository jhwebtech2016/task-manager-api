const express = require('express')
require('./db/mongoose')
const app = express()
const port = process.env.PORT
const multer = require('multer')
const upload = multer({
    dest : 'images',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb) {
            if(!file.originalname.match(/\.(doc|docx)$/)){

                return cb(new Error('please Upload Word File Only !'))
            }
            cb(undefined,true)

    }
})
app.use(express.json())
const UserRouter = require('./Router/user')
const TaskRouter =  require('./Router/task')

app.use(UserRouter)
app.use(TaskRouter)

app.post('/upload', upload.single('upload'), (req,res) => {
    
    res.send()
},(error,req,res,next) => {

        res.status(400).send({ error : error.message })
})

app.listen(port,() => {

    console.log('server Is up! ' +  port)
})

