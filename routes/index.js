const router = require('express').Router()
const userRoute = require('./users')
const courseRoute = require('./course')

router.use('/users', userRoute)
router.use('/courses', courseRoute)

module.exports = router