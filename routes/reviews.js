const router = require('express').Router()
const reviewController = require('../controllers/review')
const { authToken } = require('../middlewares/auth')

router.post('/add/:courseId', authToken, reviewController.addRating)

module.exports = router