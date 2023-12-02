'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_R_PROBLEM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TB_R_PROBLEM.belongsTo(models.TB_M_WORK_SHIFT, { foreignKey: 'SHIFT_CD', as: 'SHIFT' });
      TB_R_PROBLEM.belongsTo(models.TB_M_ASSET, { foreignKey: 'ASSET_ID', as: 'ASSET' });
      TB_R_PROBLEM.belongsTo(models.TB_M_PROB_CAT, { foreignKey: 'PROB_CAT_CD', as: 'PROBLEMCATEGORY' });
      TB_R_PROBLEM.belongsTo(models.TB_M_TICKET, { foreignKey: 'TICKET_STS', as: 'TICKETSTATUS' });
      TB_R_PROBLEM.belongsTo(models.TB_M_CM_STS, { foreignKey: 'CM_STS', as: 'CMSTATUS' });
      TB_R_PROBLEM.belongsTo(models.TB_M_USER, { foreignKey: 'USER_ID', as: 'USER' });
    }
  }
  TB_R_PROBLEM.init(
    {
      BNF_TICKET_NO: {
        primaryKey: true,
        type: DataTypes.STRING(10),
        allowNull: false
      },
      PRODUCTION_ID: {
        type: DataTypes.STRING(20)
      },
      PROBLEM_DT: {
        type: DataTypes.DATE
      },
      SHOP_NM: {
        type: DataTypes.STRING(25)
      },
      SHIFT_CD: {
        type: DataTypes.STRING(5)
      },
      GROUP_NM: {
        type: DataTypes.STRING(10)
      },
      ASSET_ID: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      EST: {
        type: DataTypes.FLOAT(2)
      },
      PROB_CAT_CD: {
        type: DataTypes.INTEGER
      },
      TICKET_STS: {
        type: DataTypes.INTEGER
      },
      CM_STS: {
        type: DataTypes.STRING(2)
      },
      USER_ID: {
        type: DataTypes.STRING(10),
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'TB_R_PROBLEM',
    tableName: 'TB_R_PROBLEM',
    timestamps: false
  });
  return TB_R_PROBLEM;
};