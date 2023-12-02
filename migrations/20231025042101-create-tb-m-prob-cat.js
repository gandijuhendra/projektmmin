'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_PROB_CAT', {
      PROB_CAT_CD: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PROB_CAT_NM: {
        type: Sequelize.STRING(10)
      },
      PROB_CAT_DESCRIPTION: {
        type: Sequelize.STRING(100)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_PROB_CAT');
  }
};