require('dotenv').config();
const { sequelize } = require('../src/models');

const syncDatabase = async () => {
  try {
    console.log('Starting database synchronization...');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: false, alter: false });
    console.log('All tables have been created successfully!');
    
    console.log('\nDatabase sync completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();
