'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_R_LTR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_R_LTR.init({
    BNF_TICKET_NO: DataTypes.STRING(10),
    PROBLEM_DT:{
      allowNull: false,
      type: DataTypes.DATE
    },
    Q1: DataTypes.INTEGER,
    Q2: DataTypes.INTEGER,
    Q3: DataTypes.INTEGER,
    Q4: DataTypes.INTEGER,
    Q5: DataTypes.INTEGER,
    Q6: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TB_R_LTR',
    tableName: 'TB_R_LTR',
    timestamps: false
  });
  return TB_R_LTR;
};