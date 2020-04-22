const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) return res.sendStatus(403);
    const token = header.split(' ')[1];
    if(!token) return res.sendStatus(403);
    let user;
    try {
        user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log(err);
        return res.sendStatus(403);
    }
    req.user = user;
    next();
}