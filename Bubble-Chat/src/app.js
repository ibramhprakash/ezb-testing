const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require("body-parser");


const Promise = require('bluebird'); // eslint-disable-line no-global-assign


const config = require('../config/config');
const companyRoutes = require('./api/routes/company');
const visitorRoutes = require('./api/routes/visitor');

mongoose.connect(
    config.mongo_url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);
mongoose.Promise = Promise;


app.use(helmet());
app.use(morgan("dev"));
//   app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let corsOptions = {
    origin: config.origin,
    methods: config.methods,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));




// Routes which should handle requestsconfig
app.get('/favicon.ico', (req, res) => res.status(200));
app.get("/", (req, res, next) => {
    res.statusCode = 200;
    console.log(req.headers["accept-language"]);
    res.setHeader('Content-Type', 'text/plain');
    res.write("It's Working");
    res.end();
});

app.use("/company", companyRoutes);
app.use("/visitor", visitorRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 200);
    console.log(error);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;