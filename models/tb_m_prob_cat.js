'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_PROB_CAT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_PROB_CAT.init({
    PROB_CAT_CD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    PROB_CAT_NM: DataTypes.STRING(10),
    PROB_CAT_DESCRIPTION: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'TB_M_PROB_CAT',
    tableName: 'TB_M_PROB_CAT',
    timestamps: false
  });
  return TB_M_PROB_CAT;
};