const router = require('express').Router()
const userRoute = require('./users')
const courseRoute = require('./course')
const reviewRoute = require('./reviews')

router.use('/users', userRoute)
router.use('/courses', courseRoute)
router.use('/reviews', reviewRoute)


module.exports = router