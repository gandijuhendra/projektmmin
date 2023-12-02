

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_R_CM', {
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
      PROB_CAT_CD: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TB_M_PROB_CAT',
          key: 'PROB_CAT_CD'
        },
        // allowNull: false
      },
      ERROR_CD: {
        type: Sequelize.STRING(20)
      },
      PROBLEM_DESCRIPTION: {
        type: Sequelize.STRING(100)
      },
      TMP_CM: {
        type: Sequelize.STRING
      },
      FIX_CM: {
        type: Sequelize.STRING
      },
      FIX_CM_PLAN: {
        // allowNull: false,
        type: Sequelize.DATE
      },
      FIX_CM_ACT: {
        // allowNull: false,
        type: Sequelize.DATE
      },
      FIX_CM_NM: {
        type: Sequelize.STRING(15),
        references: {
          model: 'TB_M_FIX_CM_STS',
          key: 'FIX_CM_NM'
        }
      },
      LAST_UPDATE_DT: {
        type: Sequelize.DATE
      },
    });
    await queryInterface.addIndex('TB_R_CM', ['BNF_TICKET_NO','PROB_CAT_CD','FIX_CM_NM']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_R_CM');
  }
};