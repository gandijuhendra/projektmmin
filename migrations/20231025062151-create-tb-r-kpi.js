'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_R_KPI', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PRODUCTION_ID: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      DT: {
        type: Sequelize.DATE,
        allowNull: false
      },
      SHOP_NM: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      SHIFT_CD: {
        type: Sequelize.STRING(5),
        references: {
          model: 'TB_M_WORK_SHIFT',
          key: 'SHIFT_CD'
        },
        allowNull: true
      }, 
      GROUP_NM: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      EST: {
        type: Sequelize.FLOAT(2),
      },
      LST: {
        type: Sequelize.FLOAT(2),
        allowNull: false
      },
      ESN: {
        type: Sequelize.INTEGER,
      },
      WH: {
        type: Sequelize.FLOAT(2),
      },
      WH_1C: {
        type: Sequelize.FLOAT(2),
      },
      WH_2A: {
        type: Sequelize.FLOAT(2),
      },
      WH_5A: {
        type: Sequelize.FLOAT(2),
      },
      ESN_SMALL: {
        type: Sequelize.INTEGER,
      },
      ESN_LTR: {
        type: Sequelize.INTEGER,
      },
      ESN_SLTR: {
        type: Sequelize.INTEGER,
      },
      ESN_REPEAT: {
        type: Sequelize.INTEGER,
      },
      SOLVED_SMALL: {
        type: Sequelize.INTEGER,
      },
      SOLVED_LTR: {
        type: Sequelize.INTEGER,
      },
      SOLVED_SLTR: {
        type: Sequelize.INTEGER,
      },
      SOLVED_REPEAT: {
        type: Sequelize.INTEGER,
      }
    });
    await queryInterface.addIndex('TB_R_KPI', ['SHIFT_CD']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_R_KPI');
  }
};