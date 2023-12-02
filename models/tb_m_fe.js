'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_FE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_FE.init({
    FE_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    FE_NM: DataTypes.STRING(20)
  }, {
    sequelize,
    modelName: 'TB_M_FE',
    tableName: 'TB_M_FE',
    timestamps: false

  });
  return TB_M_FE;
};