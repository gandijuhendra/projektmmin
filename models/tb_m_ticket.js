'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TB_M_TICKET extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_M_TICKET.init({
    TICKET_STS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    TICKET_NM: DataTypes.STRING(10),
    TICKET_DESCRIPTION: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'TB_M_TICKET',
    tableName: 'TB_M_TICKET',
    timestamps: false
  });
  return TB_M_TICKET;
};