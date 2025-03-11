import { nanoid } from "nanoid";

export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Url",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      short_code: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: () => nanoid(6),
      },
      long_url: { type: DataTypes.STRING, allowNull: false },
      clicks: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      timestamps: true,
    }
  );
};
