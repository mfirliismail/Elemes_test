const jwt = require('jsonwebtoken')
const { Users } = require('../models')

module.exports = {
    authToken: async(req, res, next) => {
        const bearerToken = req.header("Authorization")

        try {
            const token = bearerToken.replace("Bearer ", "")
            jwt.verify(token, process.env.PWD_TOKEN, (err, res) => {
                if (err) {
                    return res.status(401).json({
                        status: "failed",
                        message: "unauthorized"
                    })
                }

                req.user = res
                next()
            })
        } catch (error) {
            res.status(401).json({
                status: "failed",
                message: "Please Log in or register"
            })
        }
    },
    authAdmin: async(req, res, next) => {
        const bearerToken = req.header("Authorization")
        const token = bearerToken.replace("Bearer ", "")
        const decode = jwt.verify(token, process.env.PWD_TOKEN)
        req.user = decode
        const user = req.user
        try {
            if (!user) {
                return res.status(400).json({
                    status: "failed",
                    message: "Authorization denied! please login"
                })
            }

            const userAdmin = await Users.findOne({ where: { id: user.id } })
            if (!userAdmin) {
                return res.status(400).json({
                    status: "failed",
                    message: "No Admin found in database"
                })
            }

            if (userAdmin.isAdmin != true) {
                return res.status(401).json({
                    status: "failed",
                    message: "You are not Admin"
                })
            }

            next()

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Invalid Token !"
            })

        }
    }
}