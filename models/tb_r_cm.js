'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_R_CM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TB_R_CM.belongsTo(models.TB_R_PROBLEM, {foreignKey: 'BNF_TICKET_NO', as: 'BNF'});
      TB_R_CM.belongsTo(models.TB_M_PROB_CAT, {foreignKey: 'PROB_CAT_CD', as: 'PROBLEMCATEGORY'});
      TB_R_CM.belongsTo(models.TB_M_FIX_CM_STS, {foreignKey: 'FIX_CM_NM', as: 'FIX'});
    }
  }
  TB_R_CM.init({
    BNF_TICKET_NO: DataTypes.STRING(10),
    PROB_CAT_CD: DataTypes.INTEGER,
    ERROR_CD: DataTypes.STRING(20),
    PROBLEM_DESCRIPTION: DataTypes.STRING(100),
    TMP_CM: DataTypes.STRING,
    FIX_CM: DataTypes.STRING,
    FIX_CM_PLAN: {
      type: DataTypes.DATE
    },
    FIX_CM_ACT: {
      type: DataTypes.DATE
    },
    FIX_CM_NM: DataTypes.STRING(10),
    LAST_UPDATE_DT: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'TB_R_CM',
    tableName: 'TB_R_CM',
    timestamps: false,
  });
  return TB_R_CM;
};