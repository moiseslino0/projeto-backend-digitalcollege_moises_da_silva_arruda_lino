'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'category_id',
        as: 'products'
      });
    }
  }
  Category.init({
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    use_in_menu: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    underscored: true,
    timestamps: true
  });
  return Category;
};