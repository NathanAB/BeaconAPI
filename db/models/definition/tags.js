/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('tags', {
  tagId: {
    type: DataTypes.INTEGER,
    field: 'tag_id',
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
  categoryId: {
    type: DataTypes.INTEGER,
    field: 'category_id',
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
}, {
  schema: 'public',
  tableName: 'tags',
  timestamps: false,
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { tags } = model;
  const { sectionsTags } = model;
  const { categories } = model;
  const { sections } = model;

  tags.hasMany(sectionsTags, {
    as: 'sectionsTagsTagIdFkeys',
    foreignKey: 'tag_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  tags.belongsTo(categories, {
    as: 'category',
    foreignKey: 'category_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  tags.belongsToMany(sections, {
    as: 'sections',
    through: sectionsTags,
    foreignKey: 'tag_id',
    otherKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
