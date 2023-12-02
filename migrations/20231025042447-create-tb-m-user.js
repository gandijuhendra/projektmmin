'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_USER', {
      USER_ID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(10)
      },
      USER_NM: {
        type: Sequelize.STRING(50)
      },
      LEVEL: {
        type: Sequelize.STRING(5)
      },
      SITE_NM: {
        type: Sequelize.STRING(25)
      },
      SHOP_NM: {
        type: Sequelize.STRING(25)
      },
      GROUP_NM: {
        type: Sequelize.STRING(10)
      },
      PASSWORD: {
        type: Sequelize.STRING(25)
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_USER');
  }
};