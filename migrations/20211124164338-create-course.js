'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Courses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            thumbnail: {
                type: Sequelize.STRING
            },
            rating: {
                type: Sequelize.INTEGER
            },
            price: {
                type: Sequelize.INTEGER
            },
            category: {
                type: Sequelize.ENUM(
                    'Business',
                    'Design',
                    'Marketing',
                    'Lifestyle',
                    'Development',
                    'Programming',
                    'Photography',
                    'Music',
                    'Others'
                )
            },
            status: {
                type: Sequelize.ENUM('Free', 'Paid')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Courses');
    }
};