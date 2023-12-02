

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TB_R_PROBLEM', {
      BNF_TICKET_NO: {
        primaryKey: true,
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      PRODUCTION_ID: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      PROBLEM_DT: {
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
      ASSET_ID: {
        type: Sequelize.STRING(20),
        references: {
          model: 'TB_M_ASSET',
          key: 'ASSET_ID'
        },
        allowNull: false
      },
      EST: {
        type: Sequelize.FLOAT(2),
      },
      PROB_CAT_CD: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TB_M_PROB_CAT',
          key: 'PROB_CAT_CD'
        }
      },
      TICKET_STS: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TB_M_TICKET',
          key: 'TICKET_STS'
        }
      },
      CM_STS: {
        type: Sequelize.STRING(2),
        references: {
          model: 'TB_M_CM_STS',
          key: 'CM_STS'
        }
      },
      USER_ID: {
        type: Sequelize.STRING(10),
        references: {
          model: 'TB_M_USER',
          key: 'USER_ID'
        },
        allowNull: false
      }
    });

    // Tambahkan indeks ke kolom yang perlu diindeks
    await queryInterface.addIndex('TB_R_PROBLEM', ['SHIFT_CD', 'ASSET_ID', 'PROB_CAT_CD', 'TICKET_STS', 'CM_STS', 'USER_ID']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TB_R_PROBLEM');
  }
};