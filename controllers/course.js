const { Course } = require('../models')
const joi = require('joi')

module.exports = {
    createCourse: async(req, res) => {
        const body = req.body
        try {
            const Schema = joi.object({
                title: joi.string().required(),
                description: joi.string().required(),
                rating: joi.number().max(5).min(0).required(),
                price: joi.number().required(),
                status: joi.string().required()
            })
            const { error } = Schema.validate({...body }, { abortEarly: false })
            if (error) {
                return res.status(400).json({
                    status: "failed",
                    error: error["details"].map(({ message }) => message)
                })
            }
            let statusField
            if (body.price > 0) {
                statusField = "Paid"
            } else {
                statusField = "Free"
            }

            const create = await Course.create({
                title: body.title,
                description: body.description,
                rating: 0,
                price: body.price,
                status: statusField
            })
            if (!create) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot create course"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "success created course",
                data: create
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    updateCourse: async(req, res) => {
        const body = req.body
        const id = req.params.id
        try {
            const findCourse = await Course.findOne({ where: { id: id } })
            let statusField
            if (body.price > 0 || findCourse.dataValues.price > 0) {
                statusField = "Paid"
            } else {
                statusField = "Free"
            }

            const update = await Course.update({
                title: body.title,
                description: body.description,
                price: body.price,
                status: statusField
            })
            if (!update[0]) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot update course"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "success updated course",
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    deleteCourse: async(req, res) => {
        const id = req.params.id
        try {
            const deleteCourse = await Course.destroy({
                where: {
                    id: id
                }
            })
            if (!deleteCourse) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot delete course"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "success delete course"
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },

}