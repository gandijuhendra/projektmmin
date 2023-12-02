'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_R_KPI extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TB_R_KPI.belongsTo(models.TB_M_WORK_SHIFT, { foreignKey: 'SHIFT_CD', as: 'SHIFT' });
    }
  }
  TB_R_KPI.init({
    PRODUCTION_ID: DataTypes.STRING(20),
    DT: DataTypes.DATE,
    SHOP_NM: DataTypes.STRING(25),
    SHIFT_CD: DataTypes.STRING(5),
    GROUP_NM: DataTypes.STRING(10),
    EST: DataTypes.FLOAT(2),
    LST: DataTypes.FLOAT(2),
    ESN: DataTypes.INTEGER,
    WH: DataTypes.FLOAT(2),
    WH_1C: DataTypes.FLOAT(2),
    WH_2A: DataTypes.FLOAT(2),
    WH_5A: DataTypes.FLOAT(2),
    ESN_SMALL: DataTypes.INTEGER,
    ESN_LTR: DataTypes.INTEGER,
    ESN_SLTR: DataTypes.INTEGER,
    ESN_REPEAT: DataTypes.INTEGER,
    SOLVED_SMALL: DataTypes.INTEGER,
    SOLVED_LTR: DataTypes.INTEGER,
    SOLVED_SLTR: DataTypes.INTEGER,
    SOLVED_REPEAT: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TB_R_KPI',
    tableName: 'TB_R_KPI',
    timestamps: false
  });
  return TB_R_KPI;
};