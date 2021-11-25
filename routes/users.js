const router = require('express').Router()
const userController = require("../controllers/users")


router.post('/signup', userController.signUp)
router.post('/login', userController.login)
router.delete('/:id', userController.softDelete)

module.exports = router