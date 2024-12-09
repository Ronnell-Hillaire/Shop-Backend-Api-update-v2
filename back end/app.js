const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');

app.use(cors());
app.options('*', cors)

require('dotenv/config');

const productsRoutes = require('./routers/products');
const CategoriesRoutes = require('./routers/categories');



//Middle ware
app.use(bodyParser.json());
app.use(morgan('tiny'));

const api = process.env["API_URL"]
//Routers
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/categories`, CategoriesRoutes)





mongoose.connect(process.env.CON_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'e-shopdb'
})
    .then(() =>{
        console.log("Database connected")
    })
    .catch((err) =>{
        console.log(err);
    })

app.listen(3000, ()=> {
    console.log('Server is now running on http://localhost:3000');
})