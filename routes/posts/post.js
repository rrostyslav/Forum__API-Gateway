const router = require('express').Router();
const axios = require('axios');

const autorization = require('../middleware/authorization');
const checkBan = require('../middleware/checkBan');

// CRUD
router.get('/:sectionId/:quantity/:page', async (req, res, next) => {
    try {
        const response = await axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
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
            url: process.env.POSTS_SERVICE + req.originalUrl,
            method: 'GET',
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        next(new Error('Server Error'))
    }
});

router.post('/:creatorId', autorization, checkBan, async (req, res, next) => {
    const creatorId = +req.params.creatorId;
    if (!creatorId || creatorId < 0) {
        const error = new Error('Bad request');
        error.status = 400;
        return next(error);
    }
    if (+req.params.creatorId !== req.user.id) return res.sendStatus(403);
    try {
        const response = await axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
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

router.put('/:id', autorization, checkBan, (req, res, next) => {
    const id = +req.params.id;
    if (!id || id < 0) {
        const error = new Error('Bad request');
        error.status = 400;
        return next(error);
    }
    let post;
    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'GET',
        json: true
    })
        .then(response => {
            post = response.data;
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
            return axios({
                url: process.env.POSTS_SERVICE + req.originalUrl,
                method: 'PUT',
                data: req.body,
                json: true
            })
        })
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.put('/section/:id', autorization, async (req, res, next) => {
    const id = +req.params.id;
    if (!id || id < 0) return sendStatus(400);
    if (!req.userRights.section_manage) return sendStatus(403);
    try {
        const response = await axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
            method: 'PUT',
            data: req.body,
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        res.sendStatus(err.response.status);
    }
});

router.delete('/:id', autorization, (req, res, next) => {
    if (!req.userRights.post_manage) return sendStatus(403);

    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'GET',
        json: true
    })
        .then(response => {
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
            return axios({
                url: process.env.POSTS_SERVICE + req.originalUrl,
                method: 'DELETE',
                json: true
            })
        })
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

//Add answer
router.post('/answer/:id', autorization, checkBan, async (req, res, next) => {
    try {
        const response = await axios({
            url: `${process.env.POSTS_SERVICE}${req.originalUrl}`,
            method: 'POST',
            data: {
                ...req.body,
                creatorId: req.user.id
            },
            json: true
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        res.sendStatus(err.response.status);
    }
});

router.put('/solution/:set/:id', autorization, checkBan, (req, res, next) => {
    axios({
        url: `${process.env.POSTS_SERVICE}/post/answers/${req.params.id}`,
        method: 'GET',
        json: true
    })
        .then(response => {
            const creator = response.data.answer.creator;
            if (req.user.id !== creator) {
                const error = new Error('You are not creator');
                error.status = 403;
                throw error;
            }
            return axios({
                url: process.env.POSTS_SERVICE + req.originalUrl,
                method: 'PUT',
                json: true
            })
        })
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.put('/answers/:id', autorization, (req, res, next) => {
    axios({
        url: process.env.POSTS_SERVICE + req.originalUrl,
        method: 'GET',
        json: true
    })
    .then(answer => {
        if(req.user.id !== answer.data.answer.creator) {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error;
        }
        return axios({
            url: process.env.POSTS_SERVICE + req.originalUrl,
            method: 'PUT',
            data: req.body,
            json: true
        })
    })
    .then(result => {
        res.status(200).json(result.data);
    })
    .catch(err => {
        console.log(err);
        next(err);
    });
});

router.put('/close/:set/:id', autorization, (req, res, next) => {
    if(!req.userRights.post_manage) return res.sendStatus(403);
    axios({
        url: `${process.env.POSTS_SERVICE}${req.originalUrl}`,
        method: 'PUT',
        json: true
    })
    .then(result => {
        res.status(200).json(result.data);
    })
    .catch(err => {
        console.log(err);
        next(err);
    });
});

router.get('/answers/:postId/:quantity/:page', (req, res, next) => {
    axios({
        url: `${process.env.POSTS_SERVICE}${req.originalUrl}`,
        method: 'GET',
        json: true
    })
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        })
});

module.exports = router;