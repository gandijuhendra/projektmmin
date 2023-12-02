'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_USER.init({
    USER_ID: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    USER_NM: DataTypes.STRING(50),
    LEVEL: DataTypes.STRING(5),
    SITE_NM: DataTypes.STRING(25),
    SHOP_NM: DataTypes.STRING(25),
    GROUP_NM: DataTypes.STRING(10),
    PASSWORD: DataTypes.STRING(25)
  }, {
    sequelize,
    modelName: 'TB_M_USER',
    tableName: 'TB_M_USER',
    timestamps: false
  });
  return TB_M_USER;
};