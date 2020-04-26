const router = require('express').Router();
const axios = require('axios');

const authorization = require('../middleware/authorization');

router.get('/:id', (req, res, next) => {
    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'GET',
        json: true
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(err.response.status).json(err.response.data);
        });
});

router.get('/', (req, res, next) => {
    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'GET',
        json: true
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(err.response.status).json(err.response.data);
        });
});

router.post('/', authorization, (req, res, next) => {
    if (!req.userRights.section_manage) {
        const error = new Error('Forbidden');
        error.status = 403;
        return next();
    }
    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'POST',
        data: req.body,
        json: true
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(err.response.status).json(err.response.data);
        });
});

router.put('/:id', authorization, async (req, res, next) => {
    if (!req.userRights.section_manage) {
        const error = new Error('Forbidden');
        error.status = 403;
        return next();
    }
    try {
        if(!req.body.title) {
            const error = new Error('Title not provided');
            error.status = 400;
            throw error;
        }
        const response = await axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
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
    if (!req.userRights.section_manage) {
        const error = new Error('Forbidden');
        error.status = 403;
        return next();
    }
    try {
        const response = await axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
            method: 'DELETE',
            json: true
        })
        res.json(response.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;