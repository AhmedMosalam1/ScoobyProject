const mongoose = require('mongoose')
const dotenv = require('dotenv').config({path:"./config.env"})
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    //useFindAndModify:false,
    //useUnifiedTopology: true
}).then(()=>console.log("DB Connected Successfully 💜💜💜 "))

const port = process.env.PORT || 3000
const server = app.listen(port,()=>{
    console.log(`app running on port ${port}`)
})