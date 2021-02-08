const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
const app = express();
const route = require("./router");
app.use(cors());
mongoose.connect('mongodb+srv://dinawaheed:23101997@cluster0.vw3rj.mongodb.net/blogs?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then((c) => {
        console.log('connect database')
    });
 



// // cors middelware
// app.use((request, response, next) => {

//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader(
//         'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     response.setHeader(
//         'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
//     );


//     next();
// })

app.use(express.json());
app.use('/images', express.static(path.join('images')));
app.use('/', route);



//if rout is wrong  then enter  the  error message
app.use('*', (req, res, next) => {
    res.status(404).json({ error: "NOT_FOUND" });
})




app.use((err, req, res, next) => {
    // Map the error and send it to user
    // instanceof
    // Check if this err is a mongoose err using instanceof
    console.log("from instance1");
    console.log(err );
    if (err instanceof mongoose.Error.ValidationError) {
      console.log("from first if");
      return res.status(422).json(err.errors);
    }
  
    if (err.code === 11000) {
      console.log("from Second If");
      res
        .status(422)
        .json({ statusCode: "ValidationError", property: err.keyValue });
    }
  
    if (err.status === 400) {
      res.status(400).json({ type: err.type });
    }
  
    if (err.message === "UN_AUTHENTICATED") {
      res.status(401).json({ statusCode: err.message });
    }
  
    res.send(err);
  });

const { PORT = 8080 } = process.env;
app.listen(process.env.PORT || PORT, () => {
    console.log("your app lisen on Port :", PORT);
})