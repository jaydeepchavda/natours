const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app')
 

// console.log(process.env)
mongoose
    .connect(
        process.env.DATABASE_LOCAL,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology: true
    }).then(() => console.log('db connected successfully!'));


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`app running on port no ${port}.....`)
})

