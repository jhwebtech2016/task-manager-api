const mongoose = require('mongoose')


mongoose.connect(process.env.mongodb_url,{useNewUrlParser:true,useCreateIndex : true,useFindAndModify:false})





