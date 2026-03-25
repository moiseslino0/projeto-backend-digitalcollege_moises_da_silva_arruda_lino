'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images'
      });
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
        as: 'options'
      });
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'product_id',
        as: 'categories'
      });
    }
  }
  Product.init({
    enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    use_in_menu: { type: DataTypes.BOOLEAN, defaultValue: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT, allowNull: false },
    price_with_discount: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true,
    timestamps: true
  });
  return Product;
};