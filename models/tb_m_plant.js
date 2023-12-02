'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_PLANT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_PLANT.init({
    SITE_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    SITE_NM: DataTypes.STRING(25)
  }, {
    sequelize,
    modelName: 'TB_M_PLANT',
    tableName: 'TB_M_PLANT',
    timestamps: false
  });
  return TB_M_PLANT;
};