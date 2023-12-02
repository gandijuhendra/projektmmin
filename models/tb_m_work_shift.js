'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_WORK_SHIFT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_WORK_SHIFT.init({
    SHIFT_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    SHIFT_NM: DataTypes.STRING(30)
  }, {
    sequelize,
    modelName: 'TB_M_WORK_SHIFT',
    tableName: 'TB_M_WORK_SHIFT',
    timestamps: false
  });
  return TB_M_WORK_SHIFT;
};