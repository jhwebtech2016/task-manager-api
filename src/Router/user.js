const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { sendwelcomemail,sendbymail } = require('../email/account')


router.get('/users/me', auth, async (req,res) => {

    // try{
    //     const user = await User.find({})
    //     res.status(201).send(user)
    // }
    // catch(e) {
    //     res.status(500).send(e)
    // } 
        res.send(req.user)

})


router.patch('/users/me',auth ,async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['age','name', 'email','passwords']
    const IsValids = updates.every((update) => allowedUpdates.includes(update))

    if(!IsValids){
        return res.status(404).send({'error' : 'Invalid Updates!'})
    }

   try{
       const user = await User.findById(req.user._id)
       updates.forEach((update) => user[update] = req.body[update])
       await user.save()       
        res.send(user)
   }
   catch(e)
   {
        res.status(500).send(e)
   }
})

router.post('/users', async (req,res) => {
    const user  = new User(req.body)
   
    try{
        await user.save()
        sendwelcomemail(user.email, user.name)
        const token = await user.getAuthMethod()
        
        res.status(201).send({user,token})    
    }
    catch (e){
        res.status(400).send(e)         
    }
   
})
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredit(req.body.email,req.body.passwords)
        const token = await user.getAuthMethod({user},'thatsmypassword')
        res.send({user, token})
    }
    catch(e){
            res.status(400).send(e)
    }

})
router.delete('/users/me',auth ,async (req,res) => {

    try{
              await req.user.remove()
              sendbymail(req.user.email,req.user.name)
            res.status(200).send(req.user)
    }
    catch(e){
            res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
            })
            await req.user.save()
            res.send()
    }catch(e)
    {
        res.status(500).send(e)
    } 


})
router.post('/users/logoutAll', auth,async(req, res) => {
    try{
      
        req.user.tokens = []        
       await req.user.save()    
       res.send({Sucess : "User Logout From All Devices !"})
    }catch(e)
    {
        res.status(500).send(e)
    }
})

const upload = multer({
    
    limits : {
        fileSize : 1000000
    },

    fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){

        return cb(new Error('Please Upload Only .jpeg or .Jpg or .png'))
    }
    cb(undefined, true)
}
})

router.post('/user/me/avatar',auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width : 250 , height : 250}).png().toBuffer()    
    req.user.avatar = buffer
        await req.user.save()
    res.send()
},(error,req,res,next)=>{

    res.status(400).send({error : error.message})
})
router.delete('/user/me/avatar',auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
res.send()
},(error,req,res,next)=>{

res.status(400).send({error : error.message})
})
router.get('/users/:id/avatar',async(req,res) => {
    try{
        const user = await User.findById(req.params.id)

    if(!user || !user.avatar ){
        throw new Error()
    }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
            res.status(404).send()
    }
    

})

module.exports = router