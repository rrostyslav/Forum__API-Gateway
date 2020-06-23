'use strict';
const router = require('express').Router();
const axios = require('axios');

const autorization = require('../../middleware/authorization');
const checkBan = require('../../middleware/checkBan');

router.get('/:postId/:quantity/:page', async (req, res, next) => {
  try {
    const result = await axios({
      url: `${process.env.POSTS_SERVICE}/answer/${req.params.postId}/${req.params.quantity}/${req.params.page}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//Add answer
router.post('/:id', autorization, checkBan, async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/answer/${req.params.id}`,
      method: 'POST',
      data: {
        ...req.body,
        creatorId: req.user.id
      },
      json: true
    });

    const user = await axios({
      url: `${process.env.PROFILES_SERVICE}/id/${req.user.id}`,
      method: 'GET',
      data: {
        ...req.body
      },
      json: true
    });
    res.status(200).json({
      ...response.data,
      user: {
        ...user.data,
        password: undefined
      }
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put('/solution/:set/:id', autorization, checkBan, async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/answer/${req.params.id}`,
      method: 'GET',
      json: true
    });
    const creator = response.data.answer.creator;
    if (req.user.id !== creator) {
      const error = new Error('You are not creator');
      error.status = 403;
      throw error;
    }
    const result = await axios({
      url: process.env.POSTS_SERVICE + req.originalUrl,
      method: 'PUT',
      json: true
    })
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  };
});

router.put('/:id', autorization, async (req, res, next) => {
  try {
    const answer = await axios({
      url: process.env.POSTS_SERVICE + req.originalUrl,
      method: 'GET',
      json: true
    });
    if (req.user.id !== answer.data.answer.creator) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    const result = await axios({
      url: process.env.POSTS_SERVICE + req.originalUrl,
      method: 'PUT',
      data: req.body,
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  };
});

module.exports = router;