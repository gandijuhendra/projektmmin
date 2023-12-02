

'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_R_LTR', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BNF_TICKET_NO: {
        type: Sequelize.STRING(10),
        references: {
          model: 'TB_R_PROBLEM',
          key: 'BNF_TICKET_NO'
        },
        allowNull: false
      },
      PROBLEM_DT: {
        allowNull: false,
        type: DataTypes.DATE
      },
      Q1: {
        type: Sequelize.INTEGER
      },
      Q2: {
        type: Sequelize.INTEGER
      },
      Q3: {
        type: Sequelize.INTEGER
      },
      Q4: {
        type: Sequelize.INTEGER
      },
      Q5: {
        type: Sequelize.INTEGER
      },
      Q6: {
        type: Sequelize.INTEGER
      }
    });
    await queryInterface.addIndex('TB_R_LTR', ['BNF_TICKET_NO']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_R_LTR');
  }
};