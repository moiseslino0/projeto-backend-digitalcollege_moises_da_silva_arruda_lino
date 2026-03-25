'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  ProductImage.init({
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    path: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'ProductImages',
    underscored: true,
    timestamps: true
  });
  return ProductImage;
};