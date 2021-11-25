const { Reviews, Course } = require('../models')
const { Transaction } = require('sequelize')
const model = require('../models/index')
const joi = require('joi')

module.exports = {
    addRating: async(req, res) => {
        const body = req.body
        const courseId = req.params.courseId
        const userId = req.user.id
        try {
            const Schema = joi.object({
                rating: joi.number().max(5).min(0).required(),
            })
            const { error } = Schema.validate({...body }, { abortEarly: false })
            if (error) {
                return res.status(400).json({
                    status: "failed",
                    error: error["details"].map(({ message }) => message)
                })
            }
            const checkCourse = await Course.findOne({ where: { id: courseId } })
            if (!checkCourse) {
                return res.status(400).json({
                    status: "failed",
                    message: "course not found"
                })
            }

            const checkUser = await Reviews.findOne({ where: { userId: userId, courseId: courseId } })
            if (checkUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "You already add review"
                })
            }

            const createReview = await Reviews.create({
                rating: body.rating,
                courseId: courseId,
                userId: userId
            })

            const avarageRating = await Reviews.findAll({
                where: {
                    courseId: courseId
                }
            })

            console.log(avarageRating)

            let ratarata = avarageRating.map(e => {
                return e.dataValues.rating
            })
            ratarata.push(body.rating)

            const sum = ratarata.reduce((a, b) => a + b)
            const reviewAsli = Math.round(sum / ratarata.length)

            const updateCourse = await Course.update({
                ...body,
                rating: reviewAsli
            }, {
                where: {
                    id: courseId
                }
            })

            if (!updateCourse[0]) {
                return res.status(400).json({
                    status: "failed",
                    message: "Unable to update database",
                });
            }

            res.status(200).json({
                status: "success",
                message: "success add review to course"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }

    }
}