const router = require('express').Router();
const axios = require('axios');

const autorization = require('../middleware/authorization');

// CRUD
router.get('/:sectionId/:quantity/:page', async (req, res, next) => {
    try {
        const response = await axios({
            url: `http://localhost:3000/post${req.originalUrl}`,
            method: 'GET',
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        res.sendStatus(err.response.status);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const response = await axios({
            url: `http://localhost:3000/post${req.originalUrl}`,
            method: 'GET',
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        next(new Error('Server Error'))
    }
});

router.post('/:creatorId', autorization, async (req, res, next) => {
    const creatorId = +req.params.creatorId;
    if (!creatorId || creatorId < 0) {
        const error = new Error('Bad request');
        error.status = 400;
        return next(error);
    }
    if (+req.params.creatorId !== req.user.id) return res.sendStatus(403);
    try {
        const response = await axios({
            url: `http://localhost:3000/post/${req.user.id}`,
            method: 'POST',
            data: req.body,
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        next(new Error('Server Error'))
    }
});

router.patch('/:id', autorization, async (req, res, next) => {
    const id = +req.params.id;
    if (!id || id < 0) {
        const error = new Error('Bad request');
        error.status = 400;
        return next(error);
    }
    let post;
    try {
        const response = await axios({
            url: `http://localhost:3000/post/${req.originalUrl}`,
            method: 'GET',
            json: true
        });
        post = response.data;
    } catch (err) {
        console.log(err);
        res.sendStatus(err.response.status);
    }
    if(!post.post || post.post.length === 0) return res.sendStatus(404);
    const creator = post.post[0].creator;
    console.log(creator, req.user.id)
    if (creator !== req.user.id) return res.sendStatus(403);
    try {
        const response = await axios({
            url: `http://localhost:3000/post/${req.originalUrl}`,
            method: 'PATCH',
            data: req.body,
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log('Error', err.response.status);
        res.sendStatus(err.response.status);
    }
});

router.patch('/section/:id');

router.delete('/:id');

//Add answer
router.post('/:id');

router.patch('/solution/:set/:id');

router.get('/answers/:quantity/:page');

router.patch('/answers/:id');

router.patch('/close/:set/:id');

module.exports = router;