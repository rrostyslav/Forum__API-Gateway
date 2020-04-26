const router = require('express').Router();
const PostRoutes = require('./post');
const AnswerRoutes = require('./answer');
const SectionRoutes = require('./section')

router.use('/section', SectionRoutes);
router.use('/answer', AnswerRoutes);
router.use('/', PostRoutes);

module.exports = router;