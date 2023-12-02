'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_FIX_CM_STS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_FIX_CM_STS.init({
    FIX_CM_NM: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    FIX_CM_DESCRIPTION: DataTypes.STRING(70),
  }, {
    sequelize,
    modelName: 'TB_M_FIX_CM_STS',
    tableName: 'TB_M_FIX_CM_STS',
    timestamps: false
  });
  return TB_M_FIX_CM_STS;
};