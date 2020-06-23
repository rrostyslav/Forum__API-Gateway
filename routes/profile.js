'use strict';
const router = require('express').Router();
const axios = require('axios');
const authorization = require('../middleware/authorization');

router.put('/makemoder/:set', authorization, async (req, res, next) => {
  try {
    if (!req.userRights.make_moder) {
      const error = new Error('Bad rights');
      error.status = 400;
      return next(error);
    }
    const result = await axios({
      url: `http://${process.env.PROFILES_SERVICE}/makemoder/${req.params.set}`,
      method: 'PUT',
      data: req.body,
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

router.get('/role/:id', async (req, res, next) => {
  try {
    const role = await axios({
      url: `http://${process.env.PROFILES_SERVICE}/role/${req.params.id}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(role.data);
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
})

router.get('/:username', async (req, res, next) => {
  try {
    const user = await axios({
      url: `${process.env.PROFILES_SERVICE}/${req.params.username}`,
      method: 'GET',
      json: true
    });
    res.status(200).json({
      ...user.data,
      password: undefined
    });
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

router.get('/id/:id', async (req, res, next) => {
  try {
    const user = await axios({
      url: `${process.env.PROFILES_SERVICE}/id/${req.params.id}`,
      method: 'GET',
      json: true
    });
    res.status(200).json({
      ...user.data,
      password: undefined
    });
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

router.get('/:quantity/:page', async (req, res, next) => {
  try {
    const users = await axios({
      url: `${process.env.PROFILES_SERVICE}/${req.params.quantity}/${req.params.page}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(users.data);
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

// REGISTER!!!
router.post('/', async (req, res, next) => {
  try {
    const result = await axios({
      url: `${process.env.PROFILES_SERVICE}`,
      method: 'POST',
      data: req.body,
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

router.put('/', authorization, async (req, res, next) => {
  try {
    const profile = await axios({
      url: `${process.env.PROFILES_SERVICE}/${req.body.userName}`,
      method: 'GET',
      json: true
    });
    console.log(req.userRights.user_manage);
    console.log(req.userRights.user_manage, req.user.userName, profile.data.user_name);
    if (req.userRights.user_manage || req.user.userName === profile.data.user_name) {
      const users = await axios({
        url: process.env.PROFILES_SERVICE,
        method: 'PUT',
        data: req.body,
        json: true
      });
      res.status(200).json(users.data);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    const error = new Error(err.response.statusText);
    error.status = err.response.status;
    next(error);
  }
});

router.delete('/:username', authorization, async (req, res, next) => {
  const username = req.params.username;
  try {
    const user = await axios({
      url: `${process.env.PROFILES_SERVICE}/${username}`,
      method: 'GET',
      json: true
    });
    console.log(req.user.userName !== user.data.user_name)
    if (req.user.userName !== user.data.user_name && !req.userRights.user_manage) {
      const error = new Error();
      error.status = 403;
      throw error;
    }
    const result = await axios({
      url: `${process.env.PROFILES_SERVICE}/${username}`,
      method: 'DELETE',
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
});

router.put('/ban', authorization, async (req, res, next) => {
  const ban = +req.body.ban;
  const userName = req.body.user_name;
  try {
    if (typeof (ban) === 'undefined' || isNaN(ban) || !userName) {
      const error = new Error();
      error.status = 400;
      throw error;
    }
    if (!req.userRights.user_manage) {
      const error = new Error();
      error.status = 403;
      throw error;
    }
    const result = await axios({
      url: `${process.env.PROFILES_SERVICE}/ban`,
      method: 'PUT',
      data: req.body,
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
});

router.post('/sendreset', async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `${process.env.PROFILES_SERVICE}/sendreset`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/reset', async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const reset_code = req.body.reset_code;
    if (!newPassword || !reset_code) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `${process.env.PROFILES_SERVICE}/reset`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const code = req.body.code;
    if (!code) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `${process.env.PROFILES_SERVICE}/verify`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/sendverify', async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      const error = new Error('No params');
      error.status = 400;
      return next(error);
    }
    const response = await axios({
      url: `${process.env.PROFILES_SERVICE}/sendverify`,
      method: 'POST',
      data: req.body
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;