const router = require('express').Router()
const courseController = require('../controllers/course')
const { authToken, authAdmin } = require('../middlewares/auth')
const cloudinary = require('../middlewares/cloudinary')

// for admins
router.post('/', authToken, cloudinary("thumbnail"), authAdmin, courseController.createCourse)
router.put('/:id', authToken, cloudinary("thumbnail"), authAdmin, courseController.updateCourse)
router.delete('/:id', authToken, authAdmin, courseController.deleteCourse)
router.get('/statistic', authToken, authAdmin, courseController.getStatistic)

// for users
router.get('/all', authToken, courseController.getAllCourse)
router.get('/category/:category', authToken, courseController.getCategoryCourse)
router.get('/popular/:category', authToken, courseController.getPopularCourseCategory)
router.get('/one/:courseId', authToken, courseController.getOneCourse)
router.get('/search/:keyword', authToken, courseController.searchCourse)

module.exports = router