'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_M_ASSET', {
      ASSET_ID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(20)
      },
      ASSET_NM: {
        type: Sequelize.STRING(100)
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_M_ASSET');
  }
};