// Simple script to test database connection
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...\n');
  console.log('Configuration:');
  console.log('- Host:', process.env.DB_HOST);
  console.log('- User:', process.env.DB_USER);
  console.log('- Database:', process.env.DB_NAME);
  console.log('- Password:', process.env.DB_PASSWORD ? '(set)' : '(not set)');
  console.log('\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Database connection successful!');

    // Test query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users table accessible: ${rows[0].count} users found`);

    // Show table structure
    const [columns] = await connection.query('DESCRIBE users');
    console.log('\n📋 Users Table Structure:');
    console.table(columns.map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null,
      Key: col.Key,
      Default: col.Default
    })));

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
    console.log('🚀 Your database is ready for the application');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n📝 Please check:');
    console.log('1. MySQL server is running');
    console.log('2. Database "quickmart" exists (run quickmart_master.sql)');
    console.log('3. Credentials in .env file are correct');
    console.log('4. User has access to the database');
  }
}

testConnection();
