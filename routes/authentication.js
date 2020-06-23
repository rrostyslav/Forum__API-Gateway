'use strict';
const router = require('express').Router();
const axios = require('axios');
const authorization = require('../middleware/authorization');

router.post('/login', async (req, res, next) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;
    if (!userName || !password) {
      const error = new Error('No fields provided');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `${process.env.AUTH_SERVICE}/login`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `http://${process.env.AUTH_SERVICE}/logout`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/logoutall', authorization, async (req, res, next) => {
  try {
    const response = await axios({
      url: `http://${process.env.AUTH_SERVICE}/logoutall`,
      method: 'POST',
      data: {
        userName: req.user.userName
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/token', async (req, res, next) => {
  try {
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `http://${process.env.AUTH_SERVICE}/token`,
      method: 'GET',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;