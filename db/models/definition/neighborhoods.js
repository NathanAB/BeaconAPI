/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('neighborhoods', {
  neighborhoodId: {
    type: DataTypes.INTEGER,
    field: 'neighborhood_id',
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
  imageUrl: {
    type: DataTypes.STRING,
    field: 'imageUrl',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'neighborhoods',
  timestamps: false,
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { neighborhoods } = model;
  const { spots } = model;

  neighborhoods.hasMany(spots, {
    as: 'spotsNeighborhoodIdFkeys',
    foreignKey: 'neighborhood_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
