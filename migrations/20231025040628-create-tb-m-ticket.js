'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_TICKET', {
      TICKET_STS: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TICKET_NM: {
        type: Sequelize.STRING(10)
      },
      TICKET_DESCRIPTION: {
        type: Sequelize.STRING(100)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_TICKET');
  }
};