const router = require('express').Router();
const axios = require('axios');

const autorization = require('../../middleware/authorization');
const checkBan = require('../../middleware/checkBan');

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

module.exports = router;