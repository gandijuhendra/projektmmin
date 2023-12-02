'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_PLANT', {
      SITE_CD: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(5)
      },
      SITE_NM: {
        type: Sequelize.STRING(25)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_PLANT');
  }
};