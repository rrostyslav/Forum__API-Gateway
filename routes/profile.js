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
            url: `${process.env.PROFILES_SERVICE}/makemoder/${req.params.set}`,
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
            url: `${process.env.PROFILES_SERVICE}/role/${req.params.id}`,
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
            url: process.env.PROFILES_SERVICE,
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
        if(req.userRights.user_manage || req.user.userName === profile.data.user_name) {
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

router.delete('/:id');

router.put('/ban/:set/:id');

module.exports = router;