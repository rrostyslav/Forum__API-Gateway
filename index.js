const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PostRoutes = require('./routes/post.js');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(bodyparser.json());
app.use(morgan('dev'));

app.use('/', PostRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.log('Service: API Gateway, PORT:', PORT);
})