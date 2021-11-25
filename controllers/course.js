const { Course, Users } = require('../models')
const joi = require('joi')
const { async } = require('q')
const { Op } = require('sequelize')

module.exports = {
    // ======================
    // admin
    // ======================
    createCourse: async(req, res) => {
        const body = req.body
        const file = req.file

        try {
            if (!req.file) {
                return res.status(400).json({
                    status: "failed",
                    message: "please upload an image for thumbnail"
                })
            }

            const Schema = joi.object({
                title: joi.string().required(),
                description: joi.string().required(),
                price: joi.number().required(),
                category: joi.string().required(),
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
                thumbnail: file.path,
                rating: 0,
                price: body.price,
                category: body.category,
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
            if (
                error.name === 'SequelizeDatabaseError' &&
                error.parent.routine === 'enum_in'
            ) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Business, Design, Marketing, Lifestyle, Development, Programming, Photography, Music, Others only for Category Course',
                });
            }
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
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
                thumbnail: req.file ? req.file.path : findCourse.dataValues.thumbnail,
                price: body.price,
                category: body.category,
                status: statusField
            }, {
                where: {
                    id: id
                }
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
            if (
                error.name === 'SequelizeDatabaseError' &&
                error.parent.routine === 'enum_in'
            ) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Business, Design, Marketing, Lifestyle, Development, Programming, Photography, Music, Others only for Category Course',
                });
            }
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
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
    getStatistic: async(req, res) => {
        try {
            const totalUsers = await Users.findAll()
            const totalCourse = await Course.findAll()
            const totalFreeCourse = await Course.findAll({ where: { status: "Free" } })

            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                totalUsers: totalUsers,
                countUsers: totalUsers.length,
                totalCourses: totalCourse,
                countCourses: totalCourse.length,
                totalFreeCourses: totalFreeCourse
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    // ======================
    // users
    // ======================
    getCategoryCourse: async(req, res) => {
        const category = req.params.category
        try {
            const findCourseCategory = await Course.findAll({
                where: {
                    category: category
                },
            })
            if (!findCourseCategory) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot find category"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                data: findCourseCategory
            })

        } catch (error) {
            if (
                error.name === 'SequelizeDatabaseError' &&
                error.parent.routine === 'enum_in'
            ) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Business, Design, Marketing, Lifestyle, Development, Programming, Photography, Music, Others only for Category Course',
                });
            }
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },
    getPopularCourseCategory: async(req, res) => {
        const category = req.params.category
        try {
            const findCourseCategory = await Course.findAll({
                where: {
                    category: category
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            if (!findCourseCategory) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot find category"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                data: findCourseCategory
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    getAllCourse: async(req, res) => {
        const field = req.query.field
        const sort = req.query.sort
        try {
            if (field == "price" && sort == "highest") {
                const findCourse = await Course.findAll({
                    order: [
                        ['price', 'DESC']
                    ]
                })
                return res.status(200).json({
                    status: "success",
                    message: "success retrieved data",
                    data: findCourse
                })
            } else if (field == "price" && sort == "lowest") {
                const findCourse = await Course.findAll({
                    order: [
                        ['price', 'ASC']
                    ]
                })
                return res.status(200).json({
                    status: "success",
                    message: "success retrieved data",
                    data: findCourse
                })
            } else if (field == "status" && sort == "free") {
                const findCourse = await Course.findAll({
                    where: {
                        status: "Free"
                    }
                })
                return res.status(200).json({
                    status: "success",
                    message: "success retrieved data",
                    data: findCourse
                })
            } else if (field == "status" && sort == "paid") {
                const findCourse = await Course.findAll({
                    where: {
                        status: "Paid"
                    }
                })
                return res.status(200).json({
                    status: "success",
                    message: "success retrieved data",
                    data: findCourse
                })
            } else {
                const findCourse = await Course.findAll()
                return res.status(200).json({
                    status: "success",
                    message: "success retrieved data",
                    data: findCourse
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    getOneCourse: async(req, res) => {
        const courseId = req.params.courseId
        try {
            const getOne = await Course.findOne({
                where: {
                    id: courseId
                }
            })
            if (!getOne) {
                return res.status(400).json({
                    status: "failed",
                    message: "cannot find course"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                data: getOne
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },
    searchCourse: async(req, res) => {
        const keyword = req.params.keyword
        try {
            const search = await Course.findAll({
                where: {
                    [Op.or]: [{
                            title: {
                                [Op.iLike]: '%' + keyword + '%'
                            }
                        },
                        {
                            description: {
                                [Op.iLike]: '%' + keyword + '%'
                            }
                        }
                    ]
                }
            })
            if (search.length == 0) {
                return res.status(400).json({
                    status: "failed",
                    message: "search not found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                data: search
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    }
}