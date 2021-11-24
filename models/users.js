'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Users.hasMany(models.Reviews, { foreignKey: "userId" })
        }
    };
    Users.init({
        fullName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Users',
    });
    return Users;
};