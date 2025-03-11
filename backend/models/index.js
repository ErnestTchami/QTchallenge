import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import userModel from "./user.js"; // Import the User model
import urlModel from "./url.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize models
db.User = userModel(sequelize, DataTypes); // Use import instead of require
db.Url = urlModel(sequelize, DataTypes);

db.User.hasMany(db.Url, { foreignKey: "user_id", as: "urls" }); // User has many Urls
db.Url.belongsTo(db.User, { foreignKey: "user_id", as: "user" }); // Url belongs to User

export default db;
