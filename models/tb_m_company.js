'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_COMPANY extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_COMPANY.init({
    COMPANY_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    COMPANY_NM: DataTypes.STRING(20),
  }, {
    sequelize,
    modelName: 'TB_M_COMPANY',
    tableName: 'TB_M_COMPANY',
    timestamps: false
  });
  return TB_M_COMPANY;
};