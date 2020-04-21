const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());
app.use(morgan('dev'));

app.use('/')

app.listen(PORT, () => {
    console.log('Service: API Gateway, PORT:', PORT);
})