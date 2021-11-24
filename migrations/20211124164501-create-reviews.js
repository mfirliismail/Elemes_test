'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Reviews', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            rating: {
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            courseId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Courses",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
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
        await queryInterface.dropTable('Reviews');
    }
};