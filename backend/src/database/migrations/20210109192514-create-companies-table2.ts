import { type } from "os";
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async(queryInterface: QueryInterface) => {
    
    await queryInterface.addColumn("Companies", "isTest", {
      type: DataTypes.BOOLEAN,
      allowNull: true
    });
  },

  down: async(queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Companies", "isTest");
  }
};
