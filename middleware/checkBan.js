module.exports = (req, res, next) => {
    if(req.user.banned) return res.sendStatus(403);
    next();
}