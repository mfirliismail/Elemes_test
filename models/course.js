'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Course.hasMany(models.Reviews, { foreignKey: "courseId" })
        }
    };
    Course.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        category: DataTypes.ENUM(
            'Business',
            'Design',
            'Marketing',
            'Lifestyle',
            'Development',
            'Programming',
            'Photography',
            'Music',
            'Others'
        ),
        status: DataTypes.ENUM('Free', 'Paid')
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;
};