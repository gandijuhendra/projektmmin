'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_CM_STS', {
      CM_STS: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(2)
      },
      CM_NM: {
        type: Sequelize.STRING(10)
      },
      CM_DESCRIPTION: {
        type: Sequelize.STRING(100)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_CM_STS');
  }
};