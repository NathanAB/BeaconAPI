/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('datesSections', {
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
  dateId: {
    type: DataTypes.INTEGER,
    field: 'date_id',
    allowNull: true,
    references: {
      model: 'dates',
      key: 'id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
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
}, {
  schema: 'public',
  tableName: 'dates_sections',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { datesSections } = model;
  const { dates } = model;
  const { sections } = model;

  datesSections.belongsTo(dates, {
    as: 'date',
    foreignKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  datesSections.belongsTo(sections, {
    as: 'section',
    foreignKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
