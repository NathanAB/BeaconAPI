/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('datesUsers', {
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
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
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
  name: {
    type: DataTypes.STRING,
    field: 'name',
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    field: 'start_time',
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    field: ' notes',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'dates_users',
  timestamps: false,
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { datesUsers } = model;
  const { dates } = model;
  const { users } = model;

  datesUsers.belongsTo(dates, {
    as: 'date',
    foreignKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  datesUsers.belongsTo(users, {
    as: 'user',
    foreignKey: 'user_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
