'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_GROUP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_GROUP.init({
    GROUP_CD: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    GROUP_NM: DataTypes.STRING(10)
  }, {
    sequelize,
    modelName: 'TB_M_GROUP',
    tableName: 'TB_M_GROUP',
    timestamps: false
  });
  return TB_M_GROUP;
};