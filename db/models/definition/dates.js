/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('dates', {
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
  description: {
    type: DataTypes.TEXT,
    field: 'description',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'dates',
  timestamps: false,
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { dates } = model;
  const { datesSections } = model;
  const { datesUsers } = model;
  const { sections } = model;
  const { users } = model;

  dates.hasMany(datesSections, {
    as: 'sectionsDateIdFkeys',
    foreignKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  dates.hasMany(datesUsers, {
    as: 'usersDateIdFkeys',
    foreignKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  dates.belongsToMany(sections, {
    as: 'sections',
    through: datesSections,
    foreignKey: 'date_id',
    otherKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  dates.belongsToMany(users, {
    as: 'users',
    through: datesUsers,
    foreignKey: 'date_id',
    otherKey: 'user_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
