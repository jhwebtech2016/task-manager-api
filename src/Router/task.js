const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', auth ,async (req,res) => {
    
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        
        await task.save()
        res.status(201).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', auth,async (req,res) => {
    
    const match = {}
    const sort = {}
    if(req.query.completed){

        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
   
    try{
    
      const task = await req.user.populate({
            path : 'tasks',
            match ,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
                
            }
            
      }).execPopulate()
        if(!task){
           return res.status(404).send({noData : "No Task Found for this user !"})
        }
        res.send(req.user.tasks)
    }
    catch(e){
        return res.status(500).send()
    }
})
router.delete('/tasks/:id',auth ,async (req,res) => {
    try{
      const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!task){
            res.status(404).send({'error' : 'No Task Found!'})
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id', auth,async (req,res) => {

    const Updates = Object.keys(req.body)
    const allowedUpdates = ['completed','description']
    const IsValids = Updates.every((update) => allowedUpdates.includes(update))
    if(!IsValids){
        return res.status(400).send({'error' : 'Updates Not Valid!'})
    }

    try{
            const task =  await Task.findOne({_id : req.params.id,owner : req.user._id})
            
             if(!task){
                return res.status(404).send()
            }
            Updates.forEach((u) => task[u] = req.body[u])
            await task.save()
            res.send(task)
    }
    catch(e){
            res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth,async (req,res) => {

    const _id = req.params.id

  try{
       // const task = await Task.findById(_id)
       const task = await Task.findOne({_id, owner : req.user._id})
        if(!task){
            return res.status(404).send(task)
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})




module.exports = router
