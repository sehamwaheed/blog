const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./router");

mongoose.connect('mongodb+srv://dinawaheed:23101997@cluster0.vw3rj.mongodb.net/blogs?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then((c) => {
        console.log('connect database')
    });



// cors middelware
app.use((request, response, next) => {

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    response.setHeader(
        'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );


    next();
})

app.use(express.json());
app.use('/images', express.static(path.join('images')));
app.use('/', route);



//if rout is wrong  then enter  the  error message
app.use('*', (req, res, next) => {
    res.status(404).json({ error: "NOT_FOUND" });
})


// if has error in  server enter this error handler
app.use((erro, req, res, next) => {
    // map error and send it to user to understand what happened
    // instansof
    //check if error is a mongoose error using instanceof

    if (erro instanceof mongoose.Error.ValidationError) {

        res.status(422).json(erro.errors);
    }
});

const { PORT = 8080 } = process.env;
app.listen(process.env.PORT || PORT, () => {
    console.log("your app lisen on Port :", PORT);
})