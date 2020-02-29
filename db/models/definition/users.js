/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('users', {
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
  email: {
    type: DataTypes.TEXT,
    field: 'email',
    allowNull: true,
  },
  authToken: {
    type: DataTypes.TEXT,
    field: 'auth_token',
    allowNull: true,
  },
  name: {
    type: DataTypes.TEXT,
    field: 'name',
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    field: 'image_url',
    allowNull: true,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at',
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'users',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { users } = model;
  const { datesUsers } = model;
  const { dates } = model;

  users.hasMany(datesUsers, {
    as: 'datesUsersUserIdFkeys',
    foreignKey: 'user_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  users.belongsToMany(dates, {
    as: 'dates',
    through: datesUsers,
    foreignKey: 'user_id',
    otherKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
