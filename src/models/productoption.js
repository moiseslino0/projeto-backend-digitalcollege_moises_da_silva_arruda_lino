'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      ProductOption.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  ProductOption.init({
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    shape: { type: DataTypes.ENUM('square', 'circle'), defaultValue: 'square' },
    radius: { type: DataTypes.INTEGER, defaultValue: 0 },
    type: { type: DataTypes.ENUM('text', 'color'), defaultValue: 'text' },
    values: { type: DataTypes.STRING, allowNull: false } // values comma-separated string
  }, {
    sequelize,
    modelName: 'ProductOption',
    tableName: 'ProductOptions',
    underscored: true,
    timestamps: true
  });
  return ProductOption;
};