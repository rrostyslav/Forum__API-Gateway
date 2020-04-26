const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PostRoutes = require('./routes/posts');
const ProfileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(bodyparser.json());
app.use(morgan('dev'));

app.use('/post', PostRoutes);
app.use('/profile', ProfileRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const status = error.status || error.response.status || 500;
    res.status(status);
    res.json({
        error: {
            message: `Server Error ${status}`
        }
    });
});

app.listen(PORT, () => {
    console.log('Service: API Gateway, PORT:', PORT);
})