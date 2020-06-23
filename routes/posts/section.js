'use strict';
const router = require('express').Router();
const axios = require('axios');

const authorization = require('../../middleware/authorization');

router.get('/:id', async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/section/${req.params.id}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/section`,
      method: 'GET',
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    next(err)
  };
});

router.post('/', authorization, async (req, res, next) => {
  try {
    if (!req.userRights.section_manage) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/section`,
      method: 'POST',
      data: req.body,
      json: true
    })
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authorization, async (req, res, next) => {
  try {
    if (!req.userRights.section_manage) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    if (!req.body.title) {
      const error = new Error('Title not provided');
      error.status = 400;
      throw error;
    }
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/section/${req.params.id}`,
      method: 'PUT',
      data: req.body,
      json: true
    })
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorization, async (req, res, next) => {
  try {
    if (!req.userRights.section_manage) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/section/${req.params.id}`,
      method: 'DELETE',
      json: true
    })
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;