import { Sequelize } from 'sequelize';

// Replace 'database_name', 'username', and 'password' with your MySQL database credentials
const sequelize = new Sequelize('my_note_taking_db', 'root', '54321', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

export default sequelize;