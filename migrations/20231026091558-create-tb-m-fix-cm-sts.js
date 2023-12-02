'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_FIX_CM_STS', {
      FIX_CM_NM: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(15)
      },
      FIX_CM_DESCRIPTION: {
        type: Sequelize.STRING(70)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_FIX_CM_STS');
  }
};