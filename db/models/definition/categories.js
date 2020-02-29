/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    field: 'id',
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    field: 'name',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'categories',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { categories } = model;
  const { tags } = model;

  categories.hasMany(tags, {
    as: 'tagsCategoryIdFkeys',
    foreignKey: 'category_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
