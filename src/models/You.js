const mongoose = require('mongoose')

const you = mongoose.model('you',{
   happy :{
       type : Boolean
   },
   name :{
       type : String
   }
})
module.exports = you