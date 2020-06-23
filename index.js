'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PostRoutes = require('./routes/posts');
const ProfileRoutes = require('./routes/profile');
const ImageRoutes = require('./routes/image-upload');
const AuthRoutes = require('./routes/authentication');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyparser.json());
app.use(morgan('dev'));

app.use('/uploads', express.static(__dirname + '/static/uploads'))

app.use('/auth', AuthRoutes);
app.use('/post', PostRoutes);
app.use('/profile', ProfileRoutes);
app.use('/image', ImageRoutes);

app.use((error, req, res, next) => {
  res.status(200).json({
    success: false,
    code: error.status,
    message: error.message
  });
})

app.listen(PORT, () => {
  console.log('Service: API Gateway, PORT:', PORT);
})