'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_COMPANY', {
      COMPANY_CD: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(5)
      },
      COMPANY_NM: {
        type: Sequelize.STRING(20)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_COMPANY');
  }
};