const userRoutes = require('./user-routes');
const thoughtRoutes = require('./api/thought-routes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;