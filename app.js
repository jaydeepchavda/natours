const fs = require('fs');
const express = require("express");

const app = express();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req,res)=>{
    res.status(200).send({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    })
});

app.post('/api/v1/tours')
const port = 3000;
app.listen(port, ()=>{
    console.log(`app running on port no ${port}.....`)
})