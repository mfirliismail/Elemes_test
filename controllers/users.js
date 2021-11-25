const { Users } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joi = require('joi')

module.exports = {

    signUp: async(req, res) => {
        const body = req.body

        try {
            const Schema = joi.object({
                fullname: joi.string().min(5).required(),
                email: joi.string().email().required(),
                password: joi.string().min(6).required()
            })

            const { error } = Schema.validate({...body }, { abortEarly: false })
            if (error) {
                return res.status(400).json({
                    status: "failed",
                    errors: error['details'].map(
                        ({ message }) => message
                    )
                })
            }
            const checkEmail = await Users.findOne({
                where: {
                    email: body.email
                }
            })
            if (checkEmail) {
                return res.status(400).json({
                    status: "failed",
                    message: "email already use"
                })
            }

            bcrypt.hash(body.password, 10, async(err, hash) => {
                const createUser = await Users.create({
                    fullname: body.fullname,
                    email: body.email,
                    password: hash
                })
                if (!createUser) {
                    return res.status(400).json({
                        status: "failed",
                        message: "cannot signup"
                    })
                }
                return res.status(200).json({
                    status: "success",
                    message: "success signup please login"
                })
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    login: async(req, res) => {
        const body = req.body
        try {
            const Schema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().min(6).required()
            })
            const { error } = Schema.validate({...body }, { abortEarly: false })
            if (error) {
                return res.status(400).json({
                    status: "failed",
                    errors: error['details'].map(
                        ({ message }) => message
                    )
                })
            }

            const checkEmail = await Users.findOne({
                where: {
                    email: body.email
                }
            });

            if (!checkEmail) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid email or password"
                });
            }
            const checkPassword = await bcrypt.compare(body.password,
                checkEmail.dataValues.password);

            if (!checkPassword) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid email or password"
                });
            }
            const payload = {
                email: checkEmail.dataValues.email,
                id: checkEmail.dataValues.id,
            };

            jwt.sign(payload, process.env.PWD_TOKEN, { expiresIn: 3600 * 24 }, (err, token) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json
                }

                return res.status(200).json({
                    status: "success",
                    message: "Logged in successfully",
                    data: token
                });
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    }
}