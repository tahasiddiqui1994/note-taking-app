import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Note extends Model {}

Note.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Note',
    timestamps: false,
  }
);

export {
  Note,
}