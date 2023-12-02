'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_LINE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_LINE.init({
    LINE_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    LINE_NM: DataTypes.STRING(30)
  }, {
    sequelize,
    modelName: 'TB_M_LINE',
    tableName: 'TB_M_LINE',
    timestamps: false
  });
  return TB_M_LINE;
};