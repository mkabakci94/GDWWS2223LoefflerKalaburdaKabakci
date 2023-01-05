const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const recipeRoutes = require('./api/routes/rezepte');
const shoplistRoutes = require('./api/routes/einkaufsliste');
const benutzerRoutes = require('./api/routes/benutzer');

app.use(morgan('dev')); 
//log requests to the console

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Parse incoming requests

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//Handling CORS

app.use('/rezepte', recipeRoutes);
app.use('/shoplist', shoplistRoutes);
//Routes which should handle requests

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
//Error handling

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
//Error handling with data

module.exports = app;