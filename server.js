const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log('Uncaught Exception   shutting down.....');
    console.log(err.name , err.message); 
    process.exit(1);
})
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
const server = app.listen(port, ()=>{
    console.log(`app running on port no ${port}.....`)
})



process.on('unhandledRejection', err => {
    console.log(err.name , err.message); 
    console.log('Undhande Rejection shutting down.....');
    server.close(() => {
        process.exit(1);
    })
})


