const { Reviews, Course } = require('../models')
const { Transaction } = require('sequelize')
const model = require('../models/index')

module.exports = {
    addRating: async(req, res) => {
        model.sequelize.transaction({
            autocommit: false,
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        }).then(async(transaction) => {

            const body = req.body
            const courseId = req.params.courseId
            const userId = req.user.id
            try {
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
                    userId: user.id
                }, { transaction })

                const avarageRating = await Reviews.findAll({
                    where: {
                        courseId: courseId
                    }
                }, { transaction })

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
                }, { transaction })

                if (!updateMovie[0]) {
                    transaction.rollback()
                    return res.status(400).json({
                        status: "failed",
                        message: "Unable to update database",
                    });
                }
                transaction.commit()
                res.status(200).json({
                    status: "success",
                    message: "success add review to course"
                })
            } catch (error) {
                transaction.rollback()
            }

        })

    }
}