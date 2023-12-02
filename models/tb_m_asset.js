'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_ASSET extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  TB_M_ASSET.init(
    {
      ASSET_ID: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(20),
      },
      ASSET_NM: DataTypes.STRING(100),
    }, {
    sequelize,
    modelName: 'TB_M_ASSET',
    tableName: 'TB_M_ASSET',
    timestamps: false
  });
  return TB_M_ASSET;
};