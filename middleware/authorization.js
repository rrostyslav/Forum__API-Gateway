const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports = async (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) return res.sendStatus(403);
    const token = header.split(' ')[1];
    if (!token) return res.sendStatus(403);
    let user;
    try {
        user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log(err);
        return res.sendStatus(403);
    }
    let role;
    try {
        role = await axios({
            url: `${process.env.PROFILES_SERVICE}/profile/role/${user.role}`,
            method: 'GET',
            json: true
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(404);
    }
    req.user = user;
    req.userRights = role.data;
    next();
}