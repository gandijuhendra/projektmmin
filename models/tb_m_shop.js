'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_SHOP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_SHOP.init({
    SHOP_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    SHOP_NM: DataTypes.STRING(25)
  }, {
    sequelize,
    modelName: 'TB_M_SHOP',
    tableName: 'TB_M_SHOP',
    timestamps: false
  });
  return TB_M_SHOP;
};