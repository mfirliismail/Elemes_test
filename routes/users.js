const router = require('express').Router()
const userController = require("../controllers/users")
const { authToken, authAdmin } = require('../middlewares/auth')

router.post('/signup', userController.signUp)
router.post('/login', userController.login)
router.delete('/:id', authToken, authAdmin, userController.softDelete)

module.exports = router