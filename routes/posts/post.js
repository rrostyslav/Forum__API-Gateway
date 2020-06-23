const router = require('express').Router();
const axios = require('axios');

const autorization = require('../../middleware/authorization');
const checkBan = require('../../middleware/checkBan');

// Get posts paged
router.get('/:sectionId/:quantity/:page', async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.sectionId}/${req.params.quantity}/${req.params.page}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Get post by id
router.get('/:id', async (req, res, next) => {
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.id}`,
      method: 'GET',
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err)
  }
});

// Create post
router.post('/', autorization, checkBan, async (req, res, next) => {
  const creatorId = req.user.id;
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post`,
      method: 'POST',
      data: {
        ...req.body,
        creatorId
      },
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err)
  }
});

// Move to section
router.put('/move', autorization, async (req, res, next) => {
  const id = +req.body.id;
  const sectionId = +req.body.section_id;
  if (!id || !sectionId) return sendStatus(400);
  if (!req.userRights.section_manage) return sendStatus(403);
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/move`,
      method: 'PUT',
      data: req.body,
      json: true
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Edit post
router.put('/:id', autorization, checkBan, async (req, res, next) => {
  const id = +req.params.id;
  try {
    if (!id || id < 0) {
      const error = new Error('Bad request');
      error.status = 400;
      throw error;
    }
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.id}`,
      method: 'GET',
      json: true
    });
    const post = response.data;
    if (!post.post || post.post.length === 0) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    };
    const creator = post.post[0].creator;
    if (creator !== req.user.id) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    };
    const result = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.id}`,
      method: 'PUT',
      data: req.body,
      json: true
    })
    res.status(200).json(result.data);
  }
  catch (err) {
    console.log(err);
    next(err);
  };
});

// Delete post
router.delete('/:id', autorization, async (req, res, next) => {
  if (!req.userRights.post_manage) return sendStatus(403);
  try {
    const response = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.id}`,
      method: 'GET',
      json: true
    })
    if (response.data.post.length === 0) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }
    const creator = response.data.post[0].creator;
    if (+req.user.id !== +creator) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    const result = await axios({
      url: `${process.env.POSTS_SERVICE}/post/${req.params.id}`,
      method: 'DELETE',
      json: true
    })
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  };
});

// Close post
router.put('/close/:set/:id', autorization, async (req, res, next) => {
  if (!req.userRights.post_manage) return res.sendStatus(403);
  try {
    const result = await axios({
      url: `${process.env.POSTS_SERVICE}/post/close/${req.params.set}/${req.params.id}`,
      method: 'PUT',
      json: true
    });
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  };
});

module.exports = router;