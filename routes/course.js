const router = require('express').Router()
const courseController = require('../controllers/course')
const { authToken, authAdmin } = require('../middlewares/auth')
const cloudinary = require('../middlewares/cloudinary')

router.post('/', authToken, cloudinary("thumbnail"), authAdmin, courseController.createCourse)
router.put('/:id', authToken, cloudinary("thumbnail"), authAdmin, courseController.updateCourse)
router.delete('/:id', courseController.deleteCourse)

module.exports = router