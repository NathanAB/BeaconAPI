/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('sectionsTags', {
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
  sectionId: {
    type: DataTypes.INTEGER,
    field: 'section_id',
    allowNull: true,
    references: {
      model: 'sections',
      key: 'id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
  tagId: {
    type: DataTypes.INTEGER,
    field: 'tag_id',
    allowNull: true,
    references: {
      model: 'tags',
      key: 'tag_id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
}, {
  schema: 'public',
  tableName: 'sections_tags',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { sectionsTags } = model;
  const { sections } = model;
  const { tags } = model;

  sectionsTags.belongsTo(sections, {
    as: 'section',
    foreignKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sectionsTags.belongsTo(tags, {
    as: 'tag',
    foreignKey: 'tag_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
