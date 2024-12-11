const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel');

dotenv.config({path:'./config.env'})
 

// console.log(process.env)
mongoose
    .connect(
        process.env.DATABASE_LOCAL,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology: true
    }).then(() => console.log('db connected successfully!'));


// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

// import data into db

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully leaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

const deleteData = async () => { 
    try{
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
    } catch (err) {
        console.log(err);
    }
    process.exit();
}
console.log(process.argv[2]);
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData() 
}

 