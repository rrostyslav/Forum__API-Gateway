const router = require('express').Router();
const PostRoutes = require('./post');
const SectionRoutes = require('./section')

router.use('/section', SectionRoutes);
router.use('/', PostRoutes);

module.exports = router;