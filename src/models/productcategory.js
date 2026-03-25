'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {}
  }
  ProductCategory.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategories',
    underscored: true,
    timestamps: true
  });
  return ProductCategory;
};