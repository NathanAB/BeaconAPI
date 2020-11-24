/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('comments', {
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
  content: {
    type: DataTypes.TEXT,
    field: 'content',
    allowNull: false,
  },
}, {
  schema: 'public',
  tableName: 'comments',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { users } = model;
  const { comments } = model;

  comments.belongsTo(users, {
    as: 'user',
    foreignKey: 'user_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
