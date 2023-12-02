'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_STATION', {
      STATION_CD: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(5)
      },
      STATION_NM: {
        type: Sequelize.STRING(30)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_STATION');
  }
};