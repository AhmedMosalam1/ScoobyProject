const userRouter = require('./Routers/userRouter')
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(express.json());
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false}));

app.set('view engine', 'ejs')




app.use('/scooby/api/users',userRouter)

app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message: `can not find ${req.originalUrl} on this server !`    
    })
})

module.exports= app
//nscc hkwx qaka rhmm


